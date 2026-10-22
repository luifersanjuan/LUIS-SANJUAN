import React, { useState } from 'react';
import { LearnerProfile } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { Printer, CheckCircle, ShieldCheck, Copy, ArrowLeft, FileSpreadsheet, Award, Sparkles, QrCode } from 'lucide-react';

interface CertificateViewProps {
  learner: LearnerProfile;
  totalXp: number;
  averageScore: number;
  completedDate: string;
  certificateHash: string;
  onBack: () => void;
  onOpenDriveSync?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  learner,
  totalXp,
  averageScore,
  completedDate,
  certificateHash,
  onBack,
  onOpenDriveSync
}) => {
  const [copied, setCopied] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificateHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Toolbar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Volver al Panel Principal</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenDriveSync && (
            <button
              onClick={onOpenDriveSync}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Guardar registro oficial del certificado en Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Registrar en Google Sheets</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
            <span>{copied ? 'Código Copiado' : 'Copiar Hash'}</span>
          </button>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Verificar en Sofía Plus</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Container (Targeted for print) */}
      <div className="print-certificate-container bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-12 border-8 border-double border-emerald-900/30 dark:border-emerald-600/40 shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Subtle Watermark & Corner Filigrees */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border-[40px] border-emerald-950 dark:border-emerald-400 flex items-center justify-center">
            <span className="text-8xl font-black text-emerald-950 dark:text-emerald-400 tracking-widest">SENA</span>
          </div>
        </div>

        {/* Decorative Inner Border Frame */}
        <div className="absolute inset-4 sm:inset-6 border-2 border-emerald-600/30 dark:border-emerald-500/30 rounded-2xl pointer-events-none" />
        <div className="absolute inset-6 sm:inset-8 border border-amber-500/25 dark:border-amber-400/20 rounded-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          
          {/* Header Institutional Identity */}
          <div className="flex flex-col items-center space-y-2">
            <SenaLogo size="lg" showText={false} />
            <h1 className="text-sm sm:text-base font-extrabold tracking-[0.25em] text-slate-700 dark:text-slate-300 uppercase mt-2">
              República de Colombia
            </h1>
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-[#39A900] uppercase">
              Servicio Nacional de Aprendizaje - SENA
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
              <span>Dirección de Formación Profesional Integral</span>
              <span>•</span>
              <span>Bienestar al Aprendiz</span>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-1.5 pt-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Otorga la presente
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
              Certificación de Inducción Institucional
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-semibold max-w-xl mx-auto">
              Apropiación del Reglamento del Aprendiz (Acuerdo 007 de 2012) y Principios Éticos de la Formación Profesional
            </p>
          </div>

          {/* Recipient Full Name */}
          <div className="space-y-1 py-1 w-full max-w-2xl border-b-2 border-emerald-600/40 pb-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">A:</p>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-300 uppercase tracking-wide">
              {learner.fullName}
            </h4>
            <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 font-semibold">
              {learner.documentType}: {learner.documentNumber}
            </p>
          </div>

          {/* Program & Ficha Details */}
          <div className="max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              Por haber cursado, participado activamente y aprobado satisfactoriamente los 5 módulos formativos del proceso de inducción reglamentaria para el programa:
            </p>
            <p className="font-bold text-base text-emerald-900 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/60 py-2 px-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
              {learner.formationProgram}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 text-slate-600 dark:text-slate-400 font-medium">
              <div>
                <strong>Ficha de Caracterización:</strong> {learner.courseCode}
              </div>
              <div>
                <strong>Regional:</strong> {learner.regional}
              </div>
              <div className="sm:col-span-2">
                <strong>Centro:</strong> {learner.trainingCenter}
              </div>
            </div>
          </div>

          {/* Academic Merits / Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-2">
            <div className="px-4 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Aprobado con {averageScore}% Global</span>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{totalXp} XP Acumulados</span>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span>Fecha: {completedDate}</span>
            </div>
          </div>

          {/* Signatures & Seal Section */}
          <div className="w-full max-w-3xl pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif italic text-lg text-slate-700 dark:text-slate-300 font-bold border-b border-slate-400 dark:border-slate-600 pb-0.5 px-6">
                  {learner.trainingCenter.split(' ')[0]} Subdirección
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Subdirector(a) de Centro</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">SENA - {learner.regional}</p>
            </div>

            {/* Official Gold Embossed Stamp */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-gradient-to-tr from-amber-100 to-amber-50 dark:from-amber-900/60 dark:to-amber-950/80 flex items-center justify-center shadow-md relative">
                <Sparkles className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                <div className="absolute inset-1 rounded-full border border-dashed border-amber-600/50 dark:border-amber-400/50" />
              </div>
              <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 tracking-widest mt-1">
                SELLO OFICIAL SENA
              </span>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif italic text-lg text-slate-700 dark:text-slate-300 font-bold border-b border-slate-400 dark:border-slate-600 pb-0.5 px-6">
                  Coordinación Académica
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Coordinador(a) Formación</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Gestión de la Formación Profesional</p>
            </div>

          </div>

          {/* Digital Verification Footer */}
          <div className="w-full pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-left gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                <QrCode className="w-10 h-10 text-slate-800 dark:text-slate-200" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Código de Verificación Digital Institucional:
                </p>
                <p className="font-mono text-[11px] text-emerald-800 dark:text-emerald-400 font-bold tracking-wider">
                  {certificateHash}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Verificable en la plataforma Sofía Plus / Zajuna del SENA
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
              <p>Documento digital emitido bajo el Acuerdo 007 de 2012</p>
              <p>Servicio Nacional de Aprendizaje SENA - Colombia</p>
            </div>
          </div>

        </div>

      </div>

      {/* Verification Modal (Simulated Sofía Plus validator) */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base text-slate-900 dark:text-white">Validación de Autenticidad SENA</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              El certificado digital con hash <strong className="font-mono text-emerald-800 dark:text-emerald-400">{certificateHash}</strong> ha sido verificado con éxito en la base de datos de inducción de aprendices.
            </p>
            
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-medium text-slate-800 dark:text-slate-200">
              <div><strong>Aprendiz:</strong> {learner.fullName}</div>
              <div><strong>Documento:</strong> {learner.documentType} {learner.documentNumber}</div>
              <div><strong>Programa:</strong> {learner.formationProgram}</div>
              <div><strong>Ficha:</strong> {learner.courseCode}</div>
              <div><strong>Estado de Inducción:</strong> <span className="text-emerald-700 dark:text-emerald-400 font-bold">COMPLETADA Y APROBADA</span></div>
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors"
            >
              Cerrar Validación
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
