import React, { useState } from 'react';
import { InductionModule } from '../types/induction';
import { ArrowLeft, Play, Lightbulb, CheckCircle, BookOpen, Sparkles, Scale, ShieldCheck, GraduationCap, Gavel, Building2 } from 'lucide-react';

interface ModuleStudyViewProps {
  module: InductionModule;
  onBack: () => void;
  onStartQuiz: () => void;
  onStartCaseStudy?: () => void;
  hasCaseStudy: boolean;
  score?: number;
}

export const ModuleStudyView: React.FC<ModuleStudyViewProps> = ({
  module,
  onBack,
  onStartQuiz,
  onStartCaseStudy,
  hasCaseStudy,
  score
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const activeLesson = module.lessons[activeLessonIndex] || module.lessons[0];

  const renderModuleIcon = (iconName: string) => {
    const props = { className: 'w-7 h-7 text-white' };
    switch (iconName) {
      case 'Building2': return <Building2 {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'ShieldAlert':
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Gavel': return <Gavel {...props} />;
      default: return <BookOpen {...props} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Volver a la Ruta de Inducción</span>
        </button>

        {score !== undefined && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Aprobado con {score}%</span>
          </span>
        )}
      </div>

      {/* Module Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${module.color} 0%, #064e3b 100%)`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-white border border-white/20">
              <span>{module.title.split(':')[0]}</span>
              <span>•</span>
              <span>Acuerdo 007 SENA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {module.title.split(':')[1] || module.title}
            </h1>
            <p className="text-sm text-emerald-50 leading-relaxed">
              {module.subtitle}
            </p>
          </div>

          <div className="flex md:flex-col items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
              {renderModuleIcon(module.iconName)}
            </div>
            <button
              onClick={onStartQuiz}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-[1.03] active:scale-95"
            >
              <Play className="w-4 h-4 fill-emerald-800 text-emerald-800" />
              <span>{score !== undefined ? 'Repetir Evaluación' : 'Ir a la Evaluación'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {module.lessons.map((lesson, idx) => (
          <button
            key={lesson.id}
            onClick={() => setActiveLessonIndex(idx)}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
              activeLessonIndex === idx
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Lección {idx + 1}: {lesson.title}
          </button>
        ))}

        {hasCaseStudy && onStartCaseStudy && (
          <button
            onClick={onStartCaseStudy}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800/60 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Simulador de Casos del Comité</span>
          </button>
        )}
      </div>

      {/* Active Lesson Content */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        <div>
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            {activeLesson.subtitle}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activeLesson.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {activeLesson.summary}
          </p>
        </div>

        {/* Key Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeLesson.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{point.title}</span>
                </h3>
                {point.tag && (
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/50">
                    {point.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Practical Tip */}
        {activeLesson.practicalTip && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Recomendación Formativa para el Aprendiz
              </h4>
              <p className="text-xs text-amber-950 dark:text-amber-100 mt-0.5 leading-relaxed">
                {activeLesson.practicalTip}
              </p>
            </div>
          </div>
        )}

        {/* Lesson Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {activeLessonIndex > 0 && (
              <button
                onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                ← Lección Anterior
              </button>
            )}
            {activeLessonIndex < module.lessons.length - 1 && (
              <button
                onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 text-xs font-semibold"
              >
                Siguiente Lección →
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasCaseStudy && onStartCaseStudy && (
              <button
                onClick={onStartCaseStudy}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 font-bold text-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Caso del Comité</span>
              </button>
            )}

            <button
              onClick={onStartQuiz}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Comenzar Quiz Gamificado</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
