import React, { useState } from 'react';
import { InductionModule } from '../types/induction';
import { soundEngine } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Flame, Star, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface GamifiedQuizViewProps {
  module: InductionModule;
  onComplete: (scorePercentage: number, earnedXp: number) => void;
  onBackToStudy: () => void;
}

export const GamifiedQuizView: React.FC<GamifiedQuizViewProps> = ({
  module,
  onComplete,
  onBackToStudy
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = module.questions;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;

    if (isCorrect) {
      soundEngine.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectAnswersCount((prev) => prev + 1);

      // Multiplier bonus for streaks
      const bonus = newStreak > 2 ? 25 : newStreak > 1 ? 10 : 0;
      setEarnedXp((prev) => prev + currentQ.points + bonus);
    } else {
      soundEngine.playIncorrect();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Calculate score
      const finalScorePercent = Math.round(
        (correctAnswersCount / questions.length) * 100
      );

      setIsFinished(true);

      if (finalScorePercent >= module.passingScore) {
        soundEngine.playFanfare();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setStreak(0);
    setEarnedXp(0);
    setIsFinished(false);
  };

  const finalScore = Math.round((correctAnswersCount / questions.length) * 100);
  const isPassed = finalScore >= module.passingScore;

  // Completion Screen
  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative">
          {isPassed ? (
            <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-950/70 border-4 border-emerald-500 flex items-center justify-center">
              <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1" />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-rose-100 dark:bg-rose-950/70 border-4 border-rose-400 flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Resultado de la Evaluación
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isPassed ? '¡Excelente trabajo, Aprendiz!' : 'Necesitas reforzar conceptos'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {isPassed
              ? `Has superado satisfactoriamente los criterios normativos de ${module.title}.`
              : `Se requiere un mínimo de ${module.passingScore}% para aprobar este módulo y avanzar hacia el certificado.`}
          </p>
        </div>

        {/* Score & Rewards Cards */}
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Calificación Final</span>
            <div className={`text-2xl font-black mt-0.5 ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {finalScore}%
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {correctAnswersCount} de {questions.length} correctas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Experiencia Ganada</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>+{earnedXp}</span>
            </div>
            <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80">Puntos de Aprendiz SENA</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {!isPassed && (
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Evaluación</span>
            </button>
          )}

          <button
            onClick={() => onComplete(finalScore, earnedXp)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Continuar Ruta de Inducción</span>
          </button>
        </div>

      </div>
    );
  }

  // Active Question Screen
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">
      
      {/* Top Bar with Question Counter, Streak & XP */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/50">
              Pregunta {currentIdx + 1} de {questions.length}
            </span>
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">{module.title.split(':')[0]}</span>
          </div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-800 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>Racha x{streak}!</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>+{currentQ.points} XP</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#39A900] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md inline-block mb-3 border border-emerald-200 dark:border-emerald-800/60">
            {currentQ.articleRef}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswer;

            let optionStyle = 'border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-semibold';
              } else {
                optionStyle = 'border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-xs sm:text-sm ${optionStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 border ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isAnswered && isSelected && !isCorrect
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1 leading-relaxed">{option}</span>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Formative Feedback Box */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
              selectedOption === currentQ.correctAnswer
                ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50/80 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {selectedOption === currentQ.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>¡Respuesta Correcta! (+{currentQ.points} XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Respuesta Incorrecta</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onBackToStudy}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Repasar Lección</span>
          </button>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <span>{currentIdx < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
