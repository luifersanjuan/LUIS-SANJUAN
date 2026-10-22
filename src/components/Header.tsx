import React, { useState, useEffect, useRef } from 'react';
import { SenaLogo } from './SenaLogo';
import { LearnerProfile, UserRole } from '../types/induction';
import {
  Flame,
  Star,
  Award,
  BookOpen,
  FileCheck,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  Moon,
  Sun,
  ShieldCheck,
  GraduationCap,
  FileSpreadsheet,
  ExternalLink,
  LogOut,
  ArrowLeftRight,
  ChevronDown,
  Check
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface HeaderProps {
  currentRole: UserRole;
  onSwitchToInstructor: () => void;
  onSwitchToLearner: () => void;
  onReturnToLanding?: () => void;
  learner: LearnerProfile;
  totalXp: number;
  streak: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onOpenPlan: () => void;
  onOpenGlossary: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  hasCertificate: boolean;
  onOpenDriveSync?: () => void;
  isDriveConnected?: boolean;
  sheetUrl?: string | null;
  instructorEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSwitchToInstructor,
  onSwitchToLearner,
  learner,
  totalXp,
  streak,
  unlockedBadgesCount,
  totalBadgesCount,
  soundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleDarkMode,
  onOpenProfile,
  onOpenPlan,
  onOpenGlossary,
  onOpenBadges,
  onOpenCertificate,
  hasCertificate,
  onOpenDriveSync,
  isDriveConnected,
  sheetUrl,
  instructorEmail,
  onReturnToLanding
}) => {
  const isInstructor = currentRole === 'instructor';
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsAvatarMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAvatarMenuOpen(false);
      }
    };

    if (isAvatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAvatarMenuOpen]);

  const handleItemClick = (action?: () => void) => {
    setIsAvatarMenuOpen(false);
    if (action) {
      action();
    }
  };

  const learnerInitials = learner.fullName
    ? learner.fullName
        .trim()
        .split(/\s+/)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AP';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs no-print transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 w-full">
        {/* Main Header Container: all commands visible in this space */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
          
          {/* Brand & Role Pill */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
            <SenaLogo size="sm" light={isDarkMode} />

            {/* Visual Role Indicator */}
            {isInstructor ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Docente / Instructor</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 whitespace-nowrap">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Aprendiz SENA</span>
              </span>
            )}
          </div>

          {/* Central Navigation Commands Bar - Always Visible */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 shrink-0">
            {isInstructor ? (
              /* Instructor Commands */
              <>
                <button
                  onClick={onSwitchToLearner}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap shadow-2xs"
                  title="Probar y experimentar la vista del estudiante"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Modo Aprendiz</span>
                </button>

                {onOpenDriveSync && (
                  <button
                    onClick={onOpenDriveSync}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    title="Administrar sincronización con Google Drive y Hojas de Cálculo"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Hoja Drive</span>
                  </button>
                )}

                {sheetUrl && (
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors border border-emerald-300/80 dark:border-emerald-700/80 whitespace-nowrap shadow-2xs"
                    title="Abrir la hoja oficial del curso en Google Drive"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Ver en Drive</span>
                  </a>
                )}
              </>
            ) : (
              /* Aprendiz Commands */
              <>
                <button
                  onClick={onOpenPlan}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                  title="Consultar el Plan de Inducción completo y estructurado"
                >
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Plan</span>
                  <span className="hidden sm:inline">de Inducción</span>
                </button>

                <button
                  onClick={onOpenGlossary}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                  title="Consultar Reglamento del Aprendiz SENA y Glosario oficial"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Reglamento</span>
                  <span className="hidden sm:inline">& Glosario</span>
                </button>

                <button
                  onClick={onOpenBadges}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                  title="Ver insignias y logros obtenidos"
                >
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Insignias</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                    {unlockedBadgesCount}/{totalBadgesCount}
                  </span>
                </button>

                {hasCertificate && (
                  <button
                    onClick={onOpenCertificate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xs shadow-emerald-500/20 transition-all animate-pulse whitespace-nowrap"
                    title="Ver tu certificado oficial generado"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                    <span>Mi Certificado</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right Action Cluster: Gamification, Preferences, Switching, Profile */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 shrink-0">
            
            {/* Gamification Stats: XP & Streak */}
            {!isInstructor && (
              <>
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-2xs whitespace-nowrap shrink-0"
                  title={`Puntos de experiencia acumulados: ${totalXp} XP`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                  <span>{totalXp}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">XP</span>
                </div>

                {streak > 0 && (
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-xs font-bold shadow-2xs whitespace-nowrap shrink-0"
                    title={`Racha de estudio: ${streak} días`}
                  >
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600 animate-bounce shrink-0" />
                    <span>{streak}</span>
                  </div>
                )}
              </>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) {
                  soundEngine.playCorrect();
                }
              }}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              aria-label="Sonido"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-1.5 rounded-lg transition-all shrink-0 ${
                isDarkMode
                  ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-2xs'
              }`}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar tema de color"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              )}
            </button>

            {/* Role Switcher Shortcuts */}
            {isInstructor ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {onReturnToLanding && (
                  <button
                    onClick={onReturnToLanding}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all border border-rose-200 dark:border-rose-800/60 whitespace-nowrap shadow-2xs"
                    title="Cerrar sesión de docente y regresar al portal de bienvenida"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onSwitchToInstructor}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-all border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shadow-2xs"
                  title="Acceso exclusivo para el instructor docente (requiere clave)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Docente</span>
                </button>
                {onReturnToLanding && (
                  <button
                    onClick={onReturnToLanding}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all border border-rose-200 dark:border-rose-800/60 whitespace-nowrap shadow-2xs"
                    title="Cerrar sesión y regresar al portal de bienvenida"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* AVATAR BUTTON & DROPDOWN MENU CONTAINER                        */}
            {/* ============================================================== */}
            <div className="relative shrink-0">
              {isInstructor ? (
                /* INSTRUCTOR AVATAR BUTTON */
                <button
                  ref={buttonRef}
                  onClick={() => setIsAvatarMenuOpen(prev => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isAvatarMenuOpen}
                  className={`flex items-center gap-2 p-1 sm:pr-2.5 rounded-full transition-all border text-left shadow-2xs group ${
                    isAvatarMenuOpen
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                      : 'bg-emerald-50/70 dark:bg-slate-800 hover:bg-emerald-100/70 dark:hover:bg-slate-700 border-emerald-300/80 dark:border-slate-700'
                  }`}
                  title="Abrir menú de gestión y perfil del Instructor"
                  aria-label="Menú del Instructor"
                >
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20 shadow-2xs shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="hidden sm:flex flex-col text-xs leading-tight min-w-0 pr-0.5">
                    <span className="font-bold text-emerald-950 dark:text-emerald-200 max-w-[95px] lg:max-w-[125px] truncate">
                      Instructor SENA
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                      Docente Activo
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 transition-transform duration-200 ${
                      isAvatarMenuOpen ? 'rotate-180 text-emerald-900 dark:text-white' : ''
                    }`}
                  />
                </button>
              ) : (
                /* APRENDIZ AVATAR BUTTON */
                <button
                  ref={buttonRef}
                  onClick={() => setIsAvatarMenuOpen(prev => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isAvatarMenuOpen}
                  className={`flex items-center gap-2 p-1 sm:pr-2.5 rounded-full transition-all border text-left shadow-2xs group ${
                    isAvatarMenuOpen
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                  title={`Abrir menú de ${learner.fullName} (Ficha: ${learner.courseCode})`}
                  aria-label="Menú del Aprendiz"
                >
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20 group-hover:ring-emerald-500 shadow-2xs shrink-0">
                    {learnerInitials}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="hidden sm:flex flex-col text-xs leading-tight min-w-0 pr-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] lg:max-w-[120px] truncate">
                      {learner.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold font-mono truncate">
                      Ficha: {learner.courseCode}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                      isAvatarMenuOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  />
                </button>
              )}

              {/* ============================================================== */}
              {/* DROPDOWN MENU FOR APRENDIZ                                     */}
              {/* ============================================================== */}
              {!isInstructor && isAvatarMenuOpen && (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-2 w-80 sm:w-88 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
                >
                  {/* Identity Header */}
                  <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-md ring-2 ring-emerald-500/20 shrink-0">
                        {learnerInitials}
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                            Aprendiz SENA
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            En Inducción
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mt-1 truncate">
                          {learner.fullName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {learner.documentType}: {learner.documentNumber}
                        </p>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold truncate mt-0.5">
                          Ficha: {learner.courseCode} • {learner.formationProgram}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {learner.trainingCenter} - {learner.regional}
                        </p>
                      </div>
                    </div>

                    {/* Gamification Stats Strip inside Menu */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-200/60 dark:border-slate-800 text-center">
                      <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-1.5 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                        <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{totalXp}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Puntos XP</span>
                      </div>
                      <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-1.5 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                        <div className="flex items-center justify-center gap-1 text-orange-500 font-bold text-xs">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" />
                          <span>{streak} d</span>
                        </div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Racha</span>
                      </div>
                      <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-1.5 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                        <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400 font-bold text-xs">
                          <Award className="w-3.5 h-3.5" />
                          <span>{unlockedBadgesCount}/{totalBadgesCount}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Insignias</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Accesos y Herramientas del Aprendiz */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Accesos de Inducción
                    </div>

                    <button
                      onClick={() => handleItemClick(onOpenProfile)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">Mi Perfil y Caracterización</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Actualizar datos, documento o ficha</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleItemClick(onOpenPlan)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">Plan de Inducción</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Cronograma estructurado de 4 semanas</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleItemClick(onOpenGlossary)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">Reglamento & Glosario SENA</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Derechos, deberes y términos clave</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleItemClick(onOpenBadges)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">Mis Insignias & Logros</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                            {unlockedBadgesCount}/{totalBadgesCount}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Medallas obtenidas en la inducción</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (hasCertificate) {
                          handleItemClick(onOpenCertificate);
                        }
                      }}
                      disabled={!hasCertificate}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                        hasCertificate
                          ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-950 dark:text-emerald-200'
                          : 'opacity-60 cursor-not-allowed text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        hasCertificate ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Mi Certificado Oficial</span>
                          {hasCertificate ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                              ¡Disponible!
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              5 módulos req.
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] truncate">
                          {hasCertificate ? 'Visualizar o imprimir documento oficial' : 'Supera los 5 módulos para generarlo'}
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Section: Preferencias */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Preferencias
                    </div>

                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        )}
                        Efectos de Sonido
                      </span>
                      <button
                        onClick={() => {
                          onToggleSound();
                          if (!soundEnabled) soundEngine.playCorrect();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          soundEnabled
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {soundEnabled ? 'Activado' : 'Silenciado'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        )}
                        Tema de Pantalla
                      </span>
                      <button
                        onClick={onToggleDarkMode}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                      </button>
                    </div>
                  </div>

                  {/* Section: Cambio de Rol & Salida */}
                  <div className="p-2 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                      onClick={() => handleItemClick(onSwitchToInstructor)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors border border-emerald-200/60 dark:border-emerald-800/40"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">Acceso Docente / Instructor</p>
                        <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 truncate">Requiere clave Sena1234</p>
                      </div>
                    </button>

                    {onReturnToLanding && (
                      <button
                        onClick={() => handleItemClick(onReturnToLanding)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-xl text-left text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-rose-200/60 dark:border-rose-900/40"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">Cerrar Sesión</p>
                          <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 truncate">Finalizar sesión y volver a inicio</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* DROPDOWN MENU FOR INSTRUCTOR                                   */}
              {/* ============================================================== */}
              {isInstructor && isAvatarMenuOpen && (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-2 w-80 sm:w-88 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
                >
                  {/* Instructor Card Header */}
                  <div className="p-4 bg-gradient-to-br from-emerald-100/70 via-teal-50/50 to-white dark:from-emerald-950/70 dark:via-slate-900 dark:to-slate-900 border-b border-emerald-200/80 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold text-base shadow-md ring-2 ring-emerald-500/30 shrink-0">
                        <ShieldCheck className="w-6 h-6 text-white" />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-200/90 dark:bg-emerald-900/90 text-emerald-900 dark:text-emerald-100">
                            Docente / Instructor
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                            SENA 2026
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mt-1 truncate">
                          {instructorEmail ? instructorEmail.split('@')[0] : 'Instructor Docente'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {instructorEmail || 'Sesión Autorizada con Clave Sena1234'}
                        </p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                          Privilegios Totales • Control de Inducción
                        </p>
                      </div>
                    </div>

                    {/* Google Drive Status Bar inside Menu */}
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Google Drive:
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isDriveConnected
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isDriveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {isDriveConnected ? 'Conectado' : 'Sin sincronizar'}
                      </span>
                    </div>
                  </div>

                  {/* Section: Herramientas del Instructor */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Herramientas y Gestión
                    </div>

                    {onOpenDriveSync && (
                      <button
                        onClick={() => handleItemClick(onOpenDriveSync)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">Sincronización con Google Drive</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Configurar o crear hoja oficial de aprendices</p>
                        </div>
                      </button>
                    )}

                    {sheetUrl ? (
                      <a
                        href={sheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsAvatarMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">Abrir Hoja en Google Drive</p>
                          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 truncate">Ver registros en vivo en la nube</p>
                        </div>
                      </a>
                    ) : (
                      <div className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-400 dark:text-slate-500">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">Ver en Drive (Pendiente)</p>
                          <p className="text-[10px] truncate">Configura la hoja para visualizar en Drive</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleItemClick(onSwitchToLearner)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">Modo Aprendiz (Simulación)</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Probar las actividades como estudiante</p>
                      </div>
                    </button>
                  </div>

                  {/* Section: Preferencias */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Preferencias
                    </div>

                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        )}
                        Efectos de Sonido
                      </span>
                      <button
                        onClick={() => {
                          onToggleSound();
                          if (!soundEnabled) soundEngine.playCorrect();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          soundEnabled
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {soundEnabled ? 'Activado' : 'Silenciado'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        )}
                        Tema de Pantalla
                      </span>
                      <button
                        onClick={onToggleDarkMode}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                      </button>
                    </div>
                  </div>

                  {/* Section: Salir */}
                  <div className="p-2 bg-slate-50/50 dark:bg-slate-900/50">
                    {onReturnToLanding && (
                      <button
                        onClick={() => handleItemClick(onReturnToLanding)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-rose-200/60 dark:border-rose-900/40"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">Cerrar Sesión de Docente</p>
                          <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 truncate">Finalizar sesión y regresar a bienvenida</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
