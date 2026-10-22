import React from 'react';
import { AlertCircle, FileSpreadsheet, Check, X } from 'lucide-react';
import { InductionProgress } from '../types/induction';

interface SheetsConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  progress: InductionProgress;
  isUpdating?: boolean;
  isLoading?: boolean;
}

export const SheetsConfirmDialog: React.FC<SheetsConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  progress,
  isUpdating = false,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const learner = progress.learner;
  const isDone = progress.completedModules.length >= 5 && progress.certificateIssued;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-[#39A900] to-teal-700 p-5 text-white flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20">
            <FileSpreadsheet className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {isUpdating ? 'Actualizar Ficha en Google Sheets' : 'Sincronizar Datos en Google Sheets'}
            </h3>
            <p className="text-xs text-emerald-100">
              Almacenamiento seguro en Google Drive oficial
            </p>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Confirmación de Operación en Google Drive:</p>
              <p>
                Se modificará la hoja de cálculo <strong>"Inducción Aprendices SENA - Registro Oficial"</strong> en tu unidad de Google Drive con la información académica y de evaluación del aprendiz.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Aprendiz:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{learner.fullName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Documento:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{learner.documentType} {learner.documentNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Ficha & Programa:</span>
              <span className="text-right font-medium text-slate-800 dark:text-slate-200 max-w-[240px] truncate">
                Ficha {learner.courseCode} - {learner.formationProgram}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Avance Inducción:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {progress.completedModules.length} de 5 módulos ({progress.totalXp} XP)
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Estado / Certificado:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {isDone ? `Emitido (${progress.certificateHash})` : 'En proceso formativo'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            ¿Deseas autorizar la escritura de estos datos en tu hoja de cálculo institucional?
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando en Sheets...</span>
              </span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirmar y Guardar en Drive</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
