import React from 'react';
import { Badge } from '../types/induction';
import { SENA_BADGES } from '../data/senaData';
import { X, Award, CheckCircle2, Lock, Sparkles, Building2, Scale, ShieldCheck, GraduationCap, Gavel } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-6 h-6 ${isUnlocked ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}` };
    switch (iconName) {
      case 'Building2': return <Building2 {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Gavel': return <Gavel {...props} />;
      case 'Award': return <Award {...props} />;
      default: return <Award {...props} />;
    }
  };

  const unlockedCount = unlockedBadgeIds.length;
  const totalCount = SENA_BADGES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-800 dark:via-amber-700 dark:to-yellow-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs">
              <Award className="w-8 h-8 text-yellow-100" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Insignias & Logros del Aprendiz</h2>
              <p className="text-xs text-amber-100 mt-0.5">
                Reconocimientos obtenidos a lo largo de tu ruta de inducción institucional
              </p>
            </div>
          </div>

          {/* Progress Bar in Header */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-100">
              Progreso de logros: {unlockedCount} de {totalCount} desbloqueados
            </span>
            <span className="font-extrabold text-white text-sm">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SENA_BADGES.map((badge: Badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-65'
                }`}
              >
                {/* Icon box */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-700 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {renderIcon(badge.icon, isUnlocked)}
                </div>

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={`text-sm font-bold leading-tight ${
                        isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {badge.title}
                    </h3>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 border border-transparent dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Obtenida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Bloqueada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {isUnlocked && (
                  <Sparkles className="w-4 h-4 text-amber-400 absolute bottom-2 right-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end transition-colors">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
