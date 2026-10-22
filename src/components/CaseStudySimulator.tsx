import React, { useState } from 'react';
import { CaseStudy } from '../types/induction';
import { soundEngine } from '../utils/soundEffects';
import { Gavel, CheckCircle2, XCircle, ArrowLeft, Sparkles, Star, User, ShieldAlert, Award } from 'lucide-react';

interface CaseStudySimulatorProps {
  caseStudy: CaseStudy;
  onBack: () => void;
  onCompleteCase: (earnedXp: number) => void;
}

export const CaseStudySimulator: React.FC<CaseStudySimulatorProps> = ({
  caseStudy,
  onBack,
  onCompleteCase
}) => {
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  const handleSelect = (idx: number) => {
    if (isResolved) return;
    setSelectedChoiceIdx(idx);
    setIsResolved(true);

    const isCorrect = caseStudy.choices[idx].isCorrect;
    if (isCorrect) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playIncorrect();
    }
  };

  const selectedChoice = selectedChoiceIdx !== null ? caseStudy.choices[selectedChoiceIdx] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span>Volver a la Lección</span>
      </button>

      {/* Case Header Card */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 dark:from-amber-900 dark:via-amber-800 dark:to-yellow-900 rounded-3xl p-6 sm:p-8 text-white relative shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Simulador de Casos del Comité
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-200 text-xs font-mono font-bold">
            Toma de Decisiones
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          {caseStudy.title}
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
          Actúa como miembro del Comité de Evaluación y Seguimiento. Aplica el reglamento con sentido formativo y debido proceso.
        </p>
      </div>

      {/* Case Context Box */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        
        {/* Character Card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              Caso Presentado:
            </span>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">{caseStudy.character}</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
              {caseStudy.scenario}
            </p>
          </div>
        </div>

        {/* Situation Dilemma */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>El Dilema a Resolver:</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
            {caseStudy.situation}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            ¿Cuál es la decisión o conducta correcta bajo el Reglamento SENA?
          </span>

          {caseStudy.choices.map((choice, idx) => {
            const isSelected = selectedChoiceIdx === idx;

            let buttonStyle = 'border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

            if (isResolved) {
              if (choice.isCorrect) {
                buttonStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-semibold';
              } else if (isSelected && !choice.isCorrect) {
                buttonStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-semibold';
              } else {
                buttonStyle = 'border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isResolved}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-xs sm:text-sm ${buttonStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 border ${
                    isResolved && choice.isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isResolved && isSelected && !choice.isCorrect
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="flex-1 leading-relaxed">{choice.text}</span>
                {isResolved && choice.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isResolved && isSelected && !choice.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Formative Resolution */}
        {isResolved && selectedChoice && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              selectedChoice.isCorrect
                ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/90 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedChoice.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>¡Excelente Decisión Formativa! (+75 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Decisión Contraria al Reglamento</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed">
              {selectedChoice.feedback}
            </p>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs font-mono font-medium flex items-center gap-2">
              <span className="font-bold">Efecto Legal SENA:</span>
              <span>{selectedChoice.regulationImpact}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-black/10 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Resolución Oficial del Caso: </strong>
              {caseStudy.resolutionSummary}
            </div>
          </div>
        )}

        {/* Bottom Action */}
        {isResolved && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onCompleteCase(selectedChoice?.isCorrect ? 75 : 25)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Award className="w-4 h-4" />
              <span>Concluir Caso y Recibir XP</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
