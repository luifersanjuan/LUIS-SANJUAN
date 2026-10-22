import React from 'react';
import { STRUCTURED_PLAN_CONTENT } from '../data/senaData';
import { X, CheckCircle, Calendar, BookOpen, Target, Sparkles, Award } from 'lucide-react';

interface StructuredPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInduction: () => void;
}

export const StructuredPlanModal: React.FC<StructuredPlanModalProps> = ({
  isOpen,
  onClose,
  onStartInduction
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-[#39A900] to-teal-800 p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/20">
              Estrategia Pedagógica Oficial
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold tracking-wider">
              Gamificación SENA
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {STRUCTURED_PLAN_CONTENT.title}
          </h2>
          <p className="text-sm text-emerald-100 max-w-2xl mt-1 leading-relaxed">
            {STRUCTURED_PLAN_CONTENT.subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Propósito Central</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Transformar la inducción tradicional en una experiencia interactiva y gamificada que garantice la comprensión cabal del reglamento del aprendiz.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm mb-1">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Marco Normativo</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Fundamentado en el <strong>Acuerdo 007 de 2012</strong> (Reglamento del Aprendiz SENA), Ley 789 de 2002 y lineamientos de Bienestar al Aprendiz.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-1">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Certificación Oficial</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Emisión de un certificado digital verificable con código QR al aprobar los 5 módulos con calificación mínima del 80%.
              </p>
            </div>
          </div>

          {/* Detailed Phase Roadmap */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Desglose por Fases de la Inducción</span>
            </h3>

            <div className="space-y-4">
              {STRUCTURED_PLAN_CONTENT.phases.map((phase, idx) => (
                <div
                  key={phase.phaseNumber}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-md transition-all bg-white dark:bg-slate-800/60 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-600" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center border border-transparent dark:border-emerald-800">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                        {phase.name}
                      </h4>
                    </div>
                    <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
                      {phase.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                    <strong className="text-slate-800 dark:text-slate-200">Objetivo: </strong>
                    {phase.objective}
                  </p>

                  <div className="space-y-1.5 mb-3 bg-slate-50/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Actividades Clave:</span>
                    {phase.activities.map((act, actIdx) => (
                      <div key={actIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Sustento Legal:</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400">{phase.legalGrounding}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Todo aprendiz matriculado debe cursar y aprobar esta ruta para iniciar su etapa lectiva.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onStartInduction();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Iniciar Ruta de Inducción</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
