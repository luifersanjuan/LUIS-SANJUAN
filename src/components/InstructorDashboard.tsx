import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Eye,
  RefreshCw,
  Search,
  Filter,
  FileText,
  Sliders,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  MessageCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { ApprenticeRecord, InductionProgress, LearnerProfile } from '../types/induction';
import { SpreadsheetInfo } from '../services/googleSheetsService';
import { User } from 'firebase/auth';

interface InstructorDashboardProps {
  currentUser: User | null;
  spreadsheetInfo: SpreadsheetInfo | null;
  apprentices: ApprenticeRecord[];
  activeLearnerProgress: InductionProgress;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: string | null;
  onOpenDriveModal: () => void;
  onRefreshDataFromSheet: () => void;
  onSwitchToLearnerView: () => void;
  onInspectLearnerCertificate: (learner: LearnerProfile, certHash?: string, certDate?: string) => void;
  onSimulateLearnerCompletion: () => void;
  onResetLearnerProgress: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentUser,
  spreadsheetInfo,
  apprentices,
  activeLearnerProgress,
  syncStatus,
  lastSyncTime,
  onOpenDriveModal,
  onRefreshDataFromSheet,
  onSwitchToLearnerView,
  onInspectLearnerCertificate,
  onSimulateLearnerCompletion,
  onResetLearnerProgress
}) => {
  // Share link settings
  const [selectedFicha, setSelectedFicha] = useState<string>(
    activeLearnerProgress.learner.courseCode || '2904512'
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Search & Filter in Table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'certified' | 'in_progress'>('all');
  const [filterFicha, setFilterFicha] = useState<string>('all');

  // Build the clean apprentice URL without instructor params
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const apprenticeShareUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('role', 'aprendiz');
    if (selectedFicha) {
      params.set('ficha', selectedFicha);
    }
    return `${origin}${pathname}?${params.toString()}`;
  }, [origin, pathname, selectedFicha]);

  // Copy apprentice link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(apprenticeShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // WhatsApp share message
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Estimados Aprendices SENA (Ficha ${selectedFicha}):\n\nLes comparto el enlace oficial para realizar la Inducción Institucional sobre el Reglamento del Aprendiz (Acuerdo 007 de 2012). Al completar los 5 módulos con mínimo el 80% obtendrán su certificado digital de inducción:\n\n👉 ${apprenticeShareUrl}\n\n¡Muchos éxitos en su formación!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Merge the active learner into the table so the instructor can see immediate live changes
  const mergedApprentices = useMemo(() => {
    const list: ApprenticeRecord[] = [...apprentices];
    const activeDoc = activeLearnerProgress.learner.documentNumber;
    const exists = list.some((a) => a.documentNumber === activeDoc);

    const scores = Object.values(activeLearnerProgress.moduleScores);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : (activeLearnerProgress.completedModules.length > 0 ? 90 : 0);

    const activeRecord: ApprenticeRecord = {
      id: 'active-session-learner',
      timestamp: new Date().toLocaleTimeString('es-CO'),
      documentType: activeLearnerProgress.learner.documentType,
      documentNumber: activeLearnerProgress.learner.documentNumber,
      fullName: `${activeLearnerProgress.learner.fullName} (Sesión activa)`,
      formationProgram: activeLearnerProgress.learner.formationProgram,
      courseCode: activeLearnerProgress.learner.courseCode,
      regional: activeLearnerProgress.learner.regional,
      trainingCenter: activeLearnerProgress.learner.trainingCenter,
      completedModulesCount: activeLearnerProgress.completedModules.length,
      averageScore: avgScore,
      totalXp: activeLearnerProgress.totalXp,
      status: activeLearnerProgress.certificateIssued ? 'Certificado' : 'En Progreso',
      certificateHash: activeLearnerProgress.certificateHash,
      certificateDate: activeLearnerProgress.certificateDate,
      lastActivity: 'Ahora mismo'
    };

    if (exists) {
      return list.map((a) => (a.documentNumber === activeDoc ? activeRecord : a));
    } else {
      return [activeRecord, ...list];
    }
  }, [apprentices, activeLearnerProgress]);

  // Filtered apprentices
  const filteredApprentices = useMemo(() => {
    return mergedApprentices.filter((item) => {
      // Status filter
      if (filterStatus === 'certified' && item.status !== 'Certificado') return false;
      if (filterStatus === 'in_progress' && item.status !== 'En Progreso') return false;

      // Ficha filter
      if (filterFicha !== 'all' && item.courseCode !== filterFicha) return false;

      // Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.fullName.toLowerCase().includes(q) ||
          item.documentNumber.includes(q) ||
          item.courseCode.includes(q) ||
          item.formationProgram.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [mergedApprentices, filterStatus, filterFicha, searchTerm]);

  // Summary Metrics
  const totalEnrolled = mergedApprentices.length;
  const totalCertified = mergedApprentices.filter((a) => a.status === 'Certificado').length;
  const totalInProgress = totalEnrolled - totalCertified;
  const avgScore = totalEnrolled > 0
    ? Math.round(mergedApprentices.reduce((acc, a) => acc + (a.averageScore || 0), 0) / totalEnrolled)
    : 0;
  const approvalRate = totalEnrolled > 0 ? Math.round((totalCertified / totalEnrolled) * 100) : 0;

  // Available unique fichas for filter
  const uniqueFichas = Array.from(new Set(mergedApprentices.map((a) => a.courseCode).filter(Boolean)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Instructor Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 pointer-events-none rounded-r-3xl blur-2xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Panel de Control Docente • Privilegios Totales</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Gestión & Seguimiento de Inducción
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Supervisa el avance de los aprendices en el Reglamento (Acuerdo 007 de 2012), administra la hoja de cálculo oficial en Google Drive y genera enlaces protegidos para que los aprendices completen sus módulos.
            </p>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onSwitchToLearnerView}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all"
            >
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>Ver como Aprendiz</span>
            </button>

            <button
              onClick={onOpenDriveModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/40 text-xs font-bold shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Configuración Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Aprendices</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalEnrolled}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Registrados en la plataforma</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Certificados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalCertified}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">5/5 módulos aprobados (≥80%)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">En Progreso</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {totalInProgress}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Completando evaluaciones</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Promedio General</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {avgScore}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Calificación de evaluaciones</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tasa de Aprobación</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            {approvalRate}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Efectividad del grupo</span>
        </div>
      </div>

      {/* Two Column Section: Google Sheets Center & Apprentice Link Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Card 1: Google Sheets Administrative Center */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    Sincronización con Google Drive & Sheets
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Almacén centralizado de resultados en tiempo real
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  currentUser
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${currentUser ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {currentUser ? 'Conectado a Google' : 'No Conectado'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Cuenta de Google:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {currentUser?.email || 'Sin sesión iniciada'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Hoja de Cálculo:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[220px]">
                    {spreadsheetInfo?.name || 'Inducción Aprendices SENA - Registro Oficial'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Última Actualización:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">
                    {lastSyncTime || 'Sincronización inicial lista'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sincronización en segundo plano:</strong> Cada vez que un aprendiz completa una evaluación, caso ético o genera su certificado, el prototipo actualiza su fila en la hoja de cálculo <em>sin interrumpir su pantalla</em>.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons for Sheet */}
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            {spreadsheetInfo?.webViewLink ? (
              <a
                href={spreadsheetInfo.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Hoja en Google Drive</span>
              </a>
            ) : (
              <button
                onClick={onOpenDriveModal}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Vincular con Google Sheets</span>
              </button>
            )}

            <button
              onClick={onRefreshDataFromSheet}
              disabled={syncStatus === 'syncing'}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              title="Recargar filas más recientes desde Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Recargar Datos</span>
            </button>
          </div>
        </div>

        {/* Card 2: Apprentice Share Link Generator */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    Compartir Enlace con los Aprendices
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enlace directo sin controles administrativos visibles
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span>Modo Aprendiz</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Número de Ficha asignada:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedFicha}
                    onChange={(e) => setSelectedFicha(e.target.value)}
                    placeholder="Ej: 2904512"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <div className="flex items-center text-slate-400 text-[11px] px-1">
                    (Se precargará en el formulario del estudiante)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Enlace seguro para aprendices:
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto select-all">
                  <span className="truncate">{apprenticeShareUrl}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                <p>
                  🛡️ <strong>Aislamiento de rol:</strong> Los aprendices que abran este enlace solo verán los 5 módulos normativos, sus evaluaciones y su certificado. No tendrán acceso al botón de sincronización de Google Sheets ni a las opciones del instructor.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons for Link Sharing */}
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleCopyLink}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs"
              title="Compartir por WhatsApp con mensaje prediseñado"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={onSwitchToLearnerView}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Probar</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Table: Apprentice Tracking & Inspection */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Seguimiento y Registro de Aprendices</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitorea el avance de los estudiantes, puntajes y códigos de certificación oficial
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, cédula o ficha..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Status Filter */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Todos ({mergedApprentices.length})
              </button>
              <button
                onClick={() => setFilterStatus('certified')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterStatus === 'certified'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 font-semibold shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Certificados ({totalCertified})
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterStatus === 'in_progress'
                    ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 font-semibold shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                En Progreso ({totalInProgress})
              </button>
            </div>

            {/* Ficha Selector Filter */}
            {uniqueFichas.length > 1 && (
              <select
                value={filterFicha}
                onChange={(e) => setFilterFicha(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
              >
                <option value="all">Todas las Fichas</option>
                {uniqueFichas.map((f) => (
                  <option key={f} value={f}>
                    Ficha {f}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">Aprendiz & Documento</th>
                <th scope="col" className="px-4 py-3">Ficha & Programa</th>
                <th scope="col" className="px-4 py-3">Progreso Normativo</th>
                <th scope="col" className="px-4 py-3 text-center">Calificación</th>
                <th scope="col" className="px-4 py-3 text-center">Puntos XP</th>
                <th scope="col" className="px-4 py-3 text-center">Estado</th>
                <th scope="col" className="px-4 py-3">Certificado Digital</th>
                <th scope="col" className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApprentices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron aprendices con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredApprentices.map((item) => {
                  const isFullyCertified = item.status === 'Certificado';
                  const isCurrentActive = item.documentNumber === activeLearnerProgress.learner.documentNumber;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isCurrentActive ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Name & Doc */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          {item.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <span className="font-bold text-slate-500 dark:text-slate-400">{item.documentType}:</span>
                          <span>{item.documentNumber}</span>
                        </div>
                      </td>

                      {/* Ficha & Program */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          Ficha {item.courseCode}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.formationProgram}
                        </div>
                      </td>

                      {/* Progress (x/5) */}
                      <td className="px-4 py-3.5 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          <span>{item.completedModulesCount} de 5 módulos</span>
                          <span className="font-mono text-slate-400">{Math.round((item.completedModulesCount / 5) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFullyCertified ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.completedModulesCount / 5) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded-md text-xs ${
                            item.averageScore >= 80
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : item.averageScore > 0
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.averageScore}%
                        </span>
                      </td>

                      {/* XP */}
                      <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {item.totalXp} XP
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isFullyCertified
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {isFullyCertified ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-500" />
                          )}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Certificate */}
                      <td className="px-4 py-3.5">
                        {item.certificateHash ? (
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block truncate max-w-[160px]">
                              {item.certificateHash}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.certificateDate || 'Emitido'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Pendiente</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1">
                        {isFullyCertified && (
                          <button
                            onClick={() =>
                              onInspectLearnerCertificate(
                                {
                                  fullName: item.fullName.replace(' (Sesión activa)', ''),
                                  documentType: item.documentType as any,
                                  documentNumber: item.documentNumber,
                                  formationProgram: item.formationProgram,
                                  courseCode: item.courseCode,
                                  regional: item.regional,
                                  trainingCenter: item.trainingCenter,
                                  avatarSeed: 'cadet-green'
                                },
                                item.certificateHash,
                                item.certificateDate
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors text-[11px]"
                            title="Ver certificado digital expedido"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Certificado</span>
                          </button>
                        )}

                        {isCurrentActive && !isFullyCertified && (
                          <button
                            onClick={onSimulateLearnerCompletion}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-semibold transition-colors text-[11px]"
                            title="Simular inducción completa para generar certificado de prueba"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Simular Aprobación</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Demo Simulation Tools for Instructor */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mostrando {filteredApprentices.length} de {mergedApprentices.length} registros</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSimulateLearnerCompletion}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-semibold"
            >
              ⚡ Simular Aprendiz Certificado
            </button>
            <span>•</span>
            <button
              onClick={onResetLearnerProgress}
              className="text-slate-500 hover:text-rose-600 transition-colors"
            >
              Reiniciar Aprendiz Activo
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
