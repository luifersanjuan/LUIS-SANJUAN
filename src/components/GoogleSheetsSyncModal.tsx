import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudUpload,
  LogOut,
  Users,
  Search,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { User } from 'firebase/auth';
import { InductionProgress } from '../types/induction';
import { googleSignIn, logoutGoogle, getAccessToken } from '../services/firebaseAuth';
import {
  findExistingSpreadsheet,
  fetchSpreadsheetRows,
  syncLearnerProgress,
  getOrCreateSpreadsheet,
  SpreadsheetInfo,
  SyncedApprenticeRow
} from '../services/googleSheetsService';
import { SheetsConfirmDialog } from './SheetsConfirmDialog';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: InductionProgress;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onSpreadsheetLoaded?: (info: SpreadsheetInfo) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  progress,
  currentUser,
  onUserChange,
  onSpreadsheetLoaded
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [rows, setRows] = useState<SyncedApprenticeRow[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyLink = () => {
    if (spreadsheet?.webViewLink) {
      navigator.clipboard.writeText(spreadsheet.webViewLink);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleCreateSheetDirectly = async () => {
    const token = await getAccessToken();
    if (!token) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const sheet = await getOrCreateSpreadsheet(token);
      setSpreadsheet(sheet);
      setSyncStatus(`Hoja "${sheet.name}" preparada y lista en tu Google Drive.`);
      await loadSheetData();
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error al preparar la hoja en Drive:', error);
      setErrorMessage(error.message || 'Error al preparar la hoja en Drive.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Load existing spreadsheet and rows when user is signed in
  const loadSheetData = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    setIsLoadingRows(true);
    setErrorMessage(null);

    try {
      const sheet = await findExistingSpreadsheet(token);
      setSpreadsheet(sheet);
      if (sheet && onSpreadsheetLoaded) {
        onSpreadsheetLoaded(sheet);
      }
      if (sheet) {
        const fetchedRows = await fetchSpreadsheetRows(token, sheet.id);
        setRows(fetchedRows);
      } else {
        setRows([]);
      }
    } catch (err: unknown) {
      console.error('Error cargando datos de Google Sheets:', err);
      setErrorMessage('No se pudieron consultar los datos de la hoja en Google Drive.');
    } finally {
      setIsLoadingRows(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadSheetData();
    }
  }, [isOpen, currentUser, loadSheetData]);

  if (!isOpen) return null;

  // Handle Google Sign-In
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onUserChange(result.user);
        await loadSheetData();
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error al conectar con Google:', error);
      setErrorMessage(error.message || 'No fue posible completar la autenticación con Google.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Sign-Out
  const handleLogout = async () => {
    try {
      await logoutGoogle();
      onUserChange(null);
      setSpreadsheet(null);
      setRows([]);
      setSyncStatus(null);
    } catch (err: unknown) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Perform confirmed sync to Google Sheets
  const handleConfirmSync = async () => {
    const token = await getAccessToken();
    if (!token) {
      setErrorMessage('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión con Google.');
      setIsConfirmOpen(false);
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);

    try {
      const res = await syncLearnerProgress(token, progress);
      setSpreadsheet(res.spreadsheet);
      if (onSpreadsheetLoaded) {
        onSpreadsheetLoaded(res.spreadsheet);
      }
      setSyncStatus(
        res.action === 'updated'
          ? `Registro del aprendiz ${progress.learner.fullName} actualizado exitosamente en la fila #${res.rowNumber}.`
          : `Aprendiz ${progress.learner.fullName} registrado correctamente como nueva fila #${res.rowNumber}.`
      );
      setIsConfirmOpen(false);
      await loadSheetData();
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error al sincronizar con Google Sheets:', error);
      setErrorMessage(error.message || 'Ocurrió un error al escribir en la hoja de cálculo.');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredRows = rows.filter((r) => {
    const term = searchFilter.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(term) ||
      r.documentNumber.includes(term) ||
      r.courseCode.includes(term) ||
      r.formationProgram.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-[#39A900] to-teal-800 p-5 sm:p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20">
              <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">Sincronización con Google Drive & Sheets</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  Oficial SENA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Almacena y gestiona en tiempo real los datos, evaluaciones y certificados de los aprendices en tu Google Drive.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Messages */}
          {syncStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm text-rose-800 dark:text-rose-200 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Connection State Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            {!currentUser ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                    Conectar cuenta de Google Workspace
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                    Inicia sesión con tu cuenta de Google institucional o personal para crear y administrar la hoja de cálculo de inducción en tu Google Drive.
                  </p>
                </div>

                {/* Google Sign In Official Styled Button per Workspace guidelines */}
                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoggingIn ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-10 h-10 rounded-full border border-emerald-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {currentUser.displayName || 'Usuario Google'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Conectado
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadSheetData}
                    disabled={isLoadingRows}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Actualizar datos desde Google Sheets"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingRows ? 'animate-spin text-emerald-600' : ''}`} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                    title="Cerrar sesión de Google"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Desconectar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Continuous Auto-Sync Status Banner */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-xs text-emerald-900 dark:text-emerald-200">
                  <strong>Sincronización continua automática:</strong> Cada evaluación aprobada, caso resuelto, actualización de ficha o emisión de certificado se guarda en segundo plano en Google Sheets sin necesidad de tocar nada.
                </p>
              </div>
              {spreadsheet?.webViewLink && (
                <a
                  href={spreadsheet.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
                >
                  <span>Abrir Hoja</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Spreadsheet Status & Actions */}
          {currentUser && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Sheet Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Database className="w-3.5 h-3.5" />
                    <span>Hoja en Google Drive</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {spreadsheet ? spreadsheet.name : 'Aún no creada en tu Drive'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Pestaña principal: <strong>Aprendices</strong>
                  </p>
                </div>

                {spreadsheet ? (
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={spreadsheet.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-colors"
                    >
                      <span>Abrir en Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold transition-colors"
                      title="Copiar enlace directo de la hoja"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{copiedUrl ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateSheetDirectly}
                    disabled={isSyncing}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Crear Hoja Oficial</span>
                  </button>
                )}
              </div>

              {/* Current Learner Status */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Ficha Actual Lista</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                    {progress.learner.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Doc: {progress.learner.documentType} {progress.learner.documentNumber} • Ficha {progress.learner.courseCode}
                  </p>
                </div>

                <div className="mt-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Progreso: <span className="text-emerald-600 font-bold">{progress.completedModules.length}/5 módulos</span> ({progress.totalXp} XP)
                </div>
              </div>

              {/* Sync Trigger Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider block mb-1">
                    Sincronización Inmediata
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Escribe o actualiza los datos actuales del aprendiz en la hoja de cálculo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>Sincronizar mi Ficha Ahora</span>
                </button>
              </div>
            </div>
          )}

          {/* Visible Direct Link Banner */}
          {currentUser && spreadsheet && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                    Enlace oficial de la Hoja de Cálculo en Google Drive:
                  </span>
                  <a
                    href={spreadsheet.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-700 dark:text-emerald-400 hover:underline truncate block max-w-xl"
                  >
                    {spreadsheet.webViewLink}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedUrl ? '¡Copiado!' : 'Copiar Enlace'}</span>
                </button>
                <a
                  href={spreadsheet.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  <span>Abrir Hoja</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Records Table Preview */}
          {currentUser && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                    Aprendices Registrados en la Hoja ({rows.length})
                  </h3>
                  {isLoadingRows && (
                    <span className="text-xs text-emerald-600 animate-pulse font-medium">
                      Consultando Google Drive...
                    </span>
                  )}
                </div>

                {rows.length > 0 && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filtrar por nombre, doc o ficha..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {rows.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    {spreadsheet ? 'Aún no hay registros de aprendices en la hoja' : 'La hoja aún no ha sido creada'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Haz clic en "Sincronizar mi Ficha Ahora" para generar la hoja oficial en tu Google Drive y almacenar tu primer registro.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#39A900] text-white uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Aprendiz</th>
                        <th className="py-2.5 px-3">Documento</th>
                        <th className="py-2.5 px-3">Ficha</th>
                        <th className="py-2.5 px-3">Programa</th>
                        <th className="py-2.5 px-3 text-center">Avance</th>
                        <th className="py-2.5 px-3 text-center">Puntaje</th>
                        <th className="py-2.5 px-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
                      {filteredRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-2 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                            {row.timestamp.split(',')[0] || row.timestamp}
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-100">
                            {row.fullName}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {row.documentType} {row.documentNumber}
                          </td>
                          <td className="py-2 px-3 font-mono font-semibold text-slate-700 dark:text-slate-200">
                            {row.courseCode}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300 max-w-[180px] truncate" title={row.formationProgram}>
                            {row.formationProgram}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-emerald-600">
                            {row.completedModulesCount}/5
                          </td>
                          <td className="py-2 px-3 text-center font-bold">
                            {row.averageScore > 0 ? `${row.averageScore}%` : '-'}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                row.status.includes('Certificado')
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {row.status.includes('Certificado') ? 'Certificado' : 'En Inducción'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Almacenamiento en Google Sheets • Acuerdo 007 de 2012 SENA</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>

      {/* Confirmation Dialog before mutating Sheet */}
      <SheetsConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSync}
        progress={progress}
        isLoading={isSyncing}
      />
    </div>
  );
};
