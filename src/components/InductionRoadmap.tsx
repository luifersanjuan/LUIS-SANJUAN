import React, { useState, useMemo } from 'react';
import { InductionModule, InductionProgress } from '../types/induction';
import { INDUCTION_MODULES, ACUERDO_007_RULES } from '../data/senaData';
import { CheckCircle2, Lock, Play, BookOpen, Award, Sparkles, Scale, ShieldCheck, GraduationCap, Gavel, Building2, FileCheck, Search, AlertTriangle, Lightbulb, FileSpreadsheet } from 'lucide-react';

interface InductionRoadmapProps {
  progress: InductionProgress;
  onSelectModule: (module: InductionModule) => void;
  onOpenCertificate: () => void;
  onOpenPlan: () => void;
  onOpenProfile: () => void;
  onOpenDriveSync?: () => void;
  isDriveConnected?: boolean;
}

export const InductionRoadmap: React.FC<InductionRoadmapProps> = ({
  progress,
  onSelectModule,
  onOpenCertificate,
  onOpenPlan,
  onOpenProfile,
  onOpenDriveSync,
  isDriveConnected
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'derechos_deberes'>('roadmap');
  const [ruleFilter, setRuleFilter] = useState<'todos' | 'derecho' | 'deber' | 'prohibicion'>('todos');
  const [ruleSearch, setRuleSearch] = useState('');

  const totalModules = INDUCTION_MODULES.length;
  const completedCount = progress.completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);
  const isAllCompleted = completedCount === totalModules;

  const renderModuleIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-6 h-6 ${isUnlocked ? 'text-white' : 'text-slate-400'}` };
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

  const filteredRules = useMemo(() => {
    return ACUERDO_007_RULES.filter((rule) => {
      const matchCat = ruleFilter === 'todos' || rule.category === ruleFilter;
      const matchQuery =
        rule.title.toLowerCase().includes(ruleSearch.toLowerCase()) ||
        rule.description.toLowerCase().includes(ruleSearch.toLowerCase()) ||
        rule.practicalApplication.toLowerCase().includes(ruleSearch.toLowerCase()) ||
        rule.numeral.toLowerCase().includes(ruleSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [ruleFilter, ruleSearch]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-950 p-6 sm:p-10 text-white overflow-hidden shadow-xl border border-emerald-700/50 dark:border-emerald-600/30">
        
        {/* Background decorative circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Reglamento del Aprendiz • Acuerdo 007 de 2012 del SENA</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              ¡Bienvenido(a), <span className="text-emerald-300">{progress.learner.fullName.split(' ')[0]}</span>!
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Inicia tu formación profesional conociendo en profundidad el <strong>Acuerdo 007 de 2012</strong>. Explora tus <strong>Derechos (Art. 7)</strong>, <strong>Deberes (Art. 9)</strong> y <strong>Prohibiciones (Art. 10)</strong>, las etapas formativas y evalúa tus competencias de forma gamificada para obtener tu <strong>Certificado Oficial</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={onOpenProfile}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors font-medium"
              >
                Programa: <span className="font-bold underline">{progress.learner.formationProgram}</span>
              </button>
              <button
                onClick={onOpenProfile}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors font-mono font-medium"
              >
                Ficha: <span className="font-bold">{progress.learner.courseCode}</span>
              </button>
            </div>
          </div>

          {/* Progress Card / Certificate Action */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 lg:w-80 shrink-0 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-200 uppercase tracking-wider">
                Progreso de Inducción
              </span>
              <span className="font-black text-white text-base">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-black/25 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-400 to-[#39A900] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-100 font-medium">
              <span>{completedCount} de {totalModules} módulos aprobados</span>
              <span>Min. 80%</span>
            </div>

            {isAllCompleted ? (
              <button
                onClick={onOpenCertificate}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Ver Mi Certificado Oficial</span>
              </button>
            ) : (
              <button
                onClick={onOpenPlan}
                className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/30"
              >
                <FileCheck className="w-4 h-4" />
                <span>Ver Plan Estructurado</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Módulos de la Ruta (5)
          </button>
          <button
            onClick={() => setActiveTab('derechos_deberes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'derechos_deberes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Directorio: Derechos, Deberes y Prohibiciones
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onOpenDriveSync && (
            <button
              onClick={onOpenDriveSync}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isDriveConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
              title="Ver hoja de registro en Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isDriveConnected ? 'Registro en Drive Conectado' : 'Conectar Google Drive'}</span>
            </button>
          )}

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
            Reglamento Oficial: Acuerdo 007 de 2012
          </span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'roadmap' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUCTION_MODULES.map((mod: InductionModule, index: number) => {
            const isCompleted = progress.completedModules.includes(mod.id);
            const score = progress.moduleScores[mod.id];
            
            // Unlocked if first module OR previous module was completed
            const isUnlocked =
              index === 0 ||
              progress.completedModules.includes(INDUCTION_MODULES[index - 1].id);

            return (
              <div
                key={mod.id}
                className={`group rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                  isCompleted
                    ? 'bg-white dark:bg-slate-900/90 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 shadow-xs'
                    : isUnlocked
                    ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-md'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                }`}
              >
                {/* Card Header Strip */}
                <div
                  className="p-5 text-white flex items-center justify-between"
                  style={{
                    backgroundColor: isUnlocked ? mod.color : '#475569'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      {renderModuleIcon(mod.iconName, isUnlocked)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 block">
                        Fase {mod.order}
                      </span>
                      <h3 className="text-sm font-bold leading-tight">
                        {mod.title.split(':')[1] || mod.title}
                      </h3>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-7 h-7 rounded-full bg-black/20 text-white flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : null}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {mod.subtitle}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Contenidos Clave:
                      </span>
                      {mod.lessons.map((lesson) => (
                        <div key={lesson.id} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-medium truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer status / action */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {isCompleted ? (
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Aprobado: {score}%</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          {mod.questions.length} preguntas • Min. 80%
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Completa el módulo anterior</span>
                        </span>
                      )}

                      {mod.caseStudy && (
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-transparent dark:border-amber-800/50 px-2 py-0.5 rounded-md">
                          Caso Comité
                        </span>
                      )}
                    </div>

                    <button
                      disabled={!isUnlocked}
                      onClick={() => onSelectModule(mod)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60'
                          : isUnlocked
                          ? 'bg-[#39A900] hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.01]'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Repasar Módulo</span>
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Estudiar y Evaluar</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloqueado</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Interactive Catalog of Rights, Duties and Prohibitions under Acuerdo 007 de 2012 */
        <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          {/* Header Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#39A900]" />
                <span>Catálogo Oficial de Derechos, Deberes y Prohibiciones</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Artículos 7, 9 y 10 del <strong>Acuerdo 007 de 2012</strong> del Consejo Directivo Nacional del SENA
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ruleSearch}
                onChange={(e) => setRuleSearch(e.target.value)}
                placeholder="Buscar por término o numeral..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 mr-1">Filtrar por:</span>
            <button
              onClick={() => setRuleFilter('todos')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                ruleFilter === 'todos'
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos ({ACUERDO_007_RULES.length})
            </button>
            <button
              onClick={() => setRuleFilter('derecho')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                ruleFilter === 'derecho'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Derechos (Art. 7)</span>
            </button>
            <button
              onClick={() => setRuleFilter('deber')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                ruleFilter === 'deber'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deberes (Art. 9)</span>
            </button>
            <button
              onClick={() => setRuleFilter('prohibicion')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                ruleFilter === 'prohibicion'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Prohibiciones (Art. 10)</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => {
              const isDerecho = rule.category === 'derecho';
              const isDeber = rule.category === 'deber';
              const isProhibicion = rule.category === 'prohibicion';

              return (
                <div
                  key={rule.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isDerecho
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 hover:border-blue-400'
                      : isDeber
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                        isDerecho
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                          : isDeber
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {rule.article} • {rule.numeral}
                    </span>

                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {isDerecho ? 'Garantía del Aprendiz' : isDeber ? 'Obligación del Aprendiz' : 'Conducta Prohibida'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {rule.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p>
                      <strong>En la vida formativa: </strong>{rule.practicalApplication}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRules.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No se encontraron reglas con el término &ldquo;{ruleSearch}&rdquo;. Intenta otra búsqueda.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
