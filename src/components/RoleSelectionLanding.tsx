import React, { useState, useEffect } from 'react';
import { SenaLogo } from './SenaLogo';
import { LearnerProfile } from '../types/induction';
import { SENA_REGIONALES } from '../data/senaData';
import { soundEngine } from '../utils/soundEffects';
import {
  ShieldCheck,
  GraduationCap,
  KeyRound,
  Lock,
  ArrowRight,
  UserCheck,
  FileSpreadsheet,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  FileText,
  School,
  IdCard,
  Mail,
  Hash,
  ChevronRight,
  Video,
  X
} from 'lucide-react';

interface RoleSelectionLandingProps {
  onSelectInstructor: (avatar: string) => void;
  onSelectLearner: (learnerData: LearnerProfile, avatar: string) => void;
  currentLearner: LearnerProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: 'es' | 'en';
  onToggleLanguage: () => void;
  initialRoleChoice?: 'instructor' | 'aprendiz' | null;
}

const INSTRUCTOR_PASSWORD = 'Sena1234';

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  onSelectInstructor,
  onSelectLearner,
  currentLearner,
  isDarkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  language,
  onToggleLanguage,
  initialRoleChoice
}) => {
  // Selected tab / active flow: 'landing' | 'instructor_pin' | 'learner_characterization' | 'avatar_selection'
  const [activeStep, setActiveStep] = useState<'landing' | 'instructor_pin' | 'learner_characterization' | 'avatar_selection'>(() => {
    if (initialRoleChoice === 'aprendiz') {
      return 'learner_characterization';
    }
    if (initialRoleChoice === 'instructor') {
      return 'instructor_pin';
    }
    return 'landing';
  });

  // Avatar selection state
  const [selectedAvatar, setSelectedAvatar] = useState('cadet-green');
  const [tempRole, setTempRole] = useState<'instructor' | 'aprendiz' | null>(null);

  const AVATAR_OPTIONS = [
    { seed: 'cadet-green', name: 'Esmeralda', color: 'bg-emerald-600' },
    { seed: 'blue-modern', name: 'Azul', color: 'bg-blue-600' },
    { seed: 'emerald-tech', name: 'Teal', color: 'bg-teal-600' },
    { seed: 'orange-friendly', name: 'Naranja', color: 'bg-orange-500' },
    { seed: 'purple-creative', name: 'Púrpura', color: 'bg-purple-600' },
  ];

  // Instructor PIN form state
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Aprendiz Characterization form state
  const [formData, setFormData] = useState<LearnerProfile>({
    fullName: '',
    documentType: 'CC',
    documentNumber: '',
    formationProgram: '',
    courseCode: '',
    regional: 'Regional Bolívar',
    trainingCenter: 'Centro de Comercio y Servicios',
    avatarSeed: 'cadet-green'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset form when entering learner mode
  useEffect(() => {
    if (activeStep === 'learner_characterization') {
      setFormData({
        fullName: '',
        documentType: 'CC',
        documentNumber: '',
        formationProgram: '',
        courseCode: '',
        regional: 'Regional Bolívar',
        trainingCenter: 'Centro de Comercio y Servicios',
        avatarSeed: 'cadet-green'
      });
    }
  }, [activeStep]);

  // Check URL params for pre-filling ficha
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ficha = params.get('ficha');
      const role = params.get('role');
      if (ficha) {
        setFormData(prev => ({ ...prev, courseCode: ficha }));
      }
      if (role === 'aprendiz') {
        setActiveStep('learner_characterization');
      } else if (role === 'instructor') {
        setActiveStep('instructor_pin');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAvatarSubmit = () => {
    if (tempRole === 'instructor') onSelectInstructor(selectedAvatar);
    else if (tempRole === 'aprendiz') onSelectLearner(formData, selectedAvatar);
  };

  // Handle Instructor Password Submission
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = instructorPassword.trim();
    
    // Check against required password Sena1234 (supporting friendly case variations)
    if (
      cleanPassword === INSTRUCTOR_PASSWORD ||
      cleanPassword.toLowerCase() === INSTRUCTOR_PASSWORD.toLowerCase()
    ) {
      setInstructorError(null);
      if (soundEnabled) soundEngine.playCorrect();
      setTempRole('instructor');
      setActiveStep('avatar_selection');
    } else {
      if (soundEnabled) soundEngine.playIncorrect();
      setInstructorError('Contraseña incorrecta.');
    }
  };

  // Validate Apprentice Form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 4) {
      errors.fullName = 'Ingresa tu nombre y apellido completos';
    }
    if (!formData.documentNumber.trim() || formData.documentNumber.trim().length < 5) {
      errors.documentNumber = 'Ingresa un número de documento válido';
    }
    if (!formData.courseCode.trim() || formData.courseCode.trim().length < 4) {
      errors.courseCode = 'Ingresa el número de ficha del programa (mínimo 4 dígitos)';
    }
    if (!formData.formationProgram.trim()) {
      errors.formationProgram = 'Indica el programa de formación';
    }
    if (!formData.regional.trim()) {
      errors.regional = 'Selecciona tu regional SENA';
    }
    if (!formData.trainingCenter.trim()) {
      errors.trainingCenter = 'Ingresa el nombre del Centro de Formación';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Apprentice Characterization Submission
  const handleLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      if (soundEnabled) soundEngine.playIncorrect();
      return;
    }
    setTempRole('aprendiz');
    setActiveStep('avatar_selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SenaLogo size="md" light={isDarkMode} />
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400 block leading-tight">
                Servicio Nacional de Aprendizaje
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Portal de Inducción • Acuerdo 007 de 2012
              </span>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={onToggleLanguage}
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-xs"
              title="Cambiar idioma"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors border border-emerald-200 dark:border-emerald-800"
              title="Ver video de inducción"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Video Inducción</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full">

          {/* VIEW 1: ROLE SELECTION CARDS */}
          {activeStep === 'landing' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              {/* Hero Banner */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Plataforma Oficial de Inducción Institucional</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Bienvenido al Portal de Formación SENA
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  Selecciona tu rol para ingresar al entorno correspondiente y continuar con tu proceso formativo.
                </p>
              </div>

              {/* Dual Role Choice Grid */}
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                
                {/* CARD 1: INSTRUCTOR / COORDINACIÓN */}
                <div className="relative group rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
                  
                  <div className="space-y-5">
                    {/* Role Header Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Control & Gestión
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Soy Instructor</span>
                      </h2>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                        Coordinación y Seguimiento Académico
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Accede al panel centralizado con privilegios completos para gestionar la hoja de cálculo en Google Sheets, monitorear los resultados de los aprendices y supervisar certificaciones.
                    </p>

                    {/* Features list */}
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Sincronización directa con Google Drive / Sheets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Monitoreo de notas, progreso de fichas y XP</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Inspección de certificados oficiales emitidos</span>
                      </li>
                    </ul>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Requiere contraseña de instructor</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setInstructorError(null);
                        setInstructorPassword('');
                        setActiveStep('instructor_pin');
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all group-hover:scale-[1.01]"
                    >
                      <KeyRound className="w-4 h-4 text-emerald-300" />
                      <span>Ingresar como Instructor</span>
                      <ChevronRight className="w-4 h-4 text-emerald-300 ml-1" />
                    </button>
                  </div>
                </div>

                {/* CARD 2: APRENDIZ SENA */}
                <div className="relative group rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/20 transition-all" />

                  <div className="space-y-5">
                    {/* Role Header Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 shadow-xs">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        Acceso Abierto
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Soy Aprendiz</span>
                      </h2>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                        Inducción Gamificada y Certificación
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Participa en los 5 módulos interactivos del Acuerdo 007 de 2012, resuelve dilemas éticos, acumula puntos de experiencia e insignias y obtén tu certificado institucional de inducción.
                    </p>

                    {/* Features list */}
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>Módulos de derechos, deberes y reglamento SENA</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>Simulador de casos de estudio reales</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>Generación y descarga de Certificado Oficial</span>
                      </li>
                    </ul>

                    {/* Notice */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[11px] text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span><strong>Sin clave.</strong> Solo completa tus datos para personalizar tu inducción.</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => setActiveStep('learner_characterization')}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all group-hover:scale-[1.01]"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-200" />
                      <span>Ingresar como Aprendiz</span>
                      <ChevronRight className="w-4 h-4 text-emerald-200 ml-1" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Institutional Disclaimer */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                <p>
                  Servicio Nacional de Aprendizaje SENA • Reglamento del Aprendiz (Acuerdo 007 de 2012)
                </p>
              </div>

            </div>
          )}

          {/* VIEW 2: INSTRUCTOR PASSWORD MODAL / CARD */}
          {activeStep === 'instructor_pin' && (
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 dark:border-emerald-500/30 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acceso Instructor</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Autenticación requerida</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep('landing')}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  Volver
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Para ingresar al panel de control, sincronizar Google Sheets y monitorear a los aprendices, ingresa la clave de instructor:
                </p>

                <form onSubmit={handleInstructorSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Contraseña de Instructor
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={instructorPassword}
                        onChange={(e) => {
                          setInstructorPassword(e.target.value);
                          if (instructorError) setInstructorError(null);
                        }}
                        placeholder="Ingresa la clave (ej: Sena1234)"
                        autoFocus
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span></span>
                    </div>
                  </div>

                  {instructorError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{instructorError}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep('landing')}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Entrar al Panel</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => setActiveStep('learner_characterization')}
                  className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium inline-flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>¿Eres aprendiz? Ingresa sin clave aquí</span>
                </button>
              </div>

            </div>
          )}

          {/* VIEW 3: APRENDIZ CHARACTERIZATION FORM */}
          {activeStep === 'learner_characterization' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Form Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-300 dark:border-teal-800">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Caracterización del Aprendiz</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Diligencia tus datos para personalizar tu inducción y tu certificado oficial (sin clave)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep('landing')}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  Cambiar Rol
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleLearnerSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Completo del Aprendiz *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                      }}
                      placeholder="Ej: Laura Camila Gómez Rincón"
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 focus:outline-hidden transition-all ${
                        formErrors.fullName
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Document Type & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Doc. *
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="CC">C.C. - Cédula Ciudadanía</option>
                      <option value="TI">T.I. - Tarjeta Identidad</option>
                      <option value="PPT">PPT - Permiso Prot. Temporal</option>
                      <option value="CE">C.E. - Cédula Extranjería</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Documento *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <IdCard className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.documentNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, documentNumber: e.target.value });
                          if (formErrors.documentNumber) setFormErrors({ ...formErrors, documentNumber: '' });
                        }}
                        placeholder="Ej: 1018492039"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 focus:outline-hidden transition-all ${
                          formErrors.documentNumber
                            ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                            : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    {formErrors.documentNumber && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.documentNumber}</p>
                    )}
                  </div>
                </div>

                {/* Course Code (Ficha) & Formation Program */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Ficha *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.courseCode}
                        onChange={(e) => {
                          setFormData({ ...formData, courseCode: e.target.value });
                          if (formErrors.courseCode) setFormErrors({ ...formErrors, courseCode: '' });
                        }}
                        placeholder="Ej: 2904512"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 font-mono focus:outline-hidden transition-all ${
                          formErrors.courseCode
                            ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                            : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    {formErrors.courseCode && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.courseCode}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Programa de Formación *
                    </label>
                    <input
                      type="text"
                      value={formData.formationProgram}
                      onChange={(e) => {
                        setFormData({ ...formData, formationProgram: e.target.value });
                        if (formErrors.formationProgram) setFormErrors({ ...formErrors, formationProgram: '' });
                      }}
                      placeholder="Ej: Tecnólogo en Análisis y Desarrollo de Software (ADSO)"
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 focus:outline-hidden transition-all ${
                        formErrors.formationProgram
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.formationProgram && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.formationProgram}</p>
                    )}
                  </div>
                </div>

                {/* Regional & Center */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Regional SENA *
                    </label>
                    <select
                      value={formData.regional}
                      onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {SENA_REGIONALES.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Centro de Formación *
                    </label>
                    <input
                      type="text"
                      value={formData.trainingCenter}
                      onChange={(e) => {
                        setFormData({ ...formData, trainingCenter: e.target.value });
                        if (formErrors.trainingCenter) setFormErrors({ ...formErrors, trainingCenter: '' });
                      }}
                      placeholder="Ej: Centro de Servicios Financieros"
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 focus:outline-hidden transition-all ${
                        formErrors.trainingCenter
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500'
                      }`}
                    />
                    {formErrors.trainingCenter && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.trainingCenter}</p>
                    )}
                  </div>
                </div>

                {/* Information banner */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Tus datos se vincularán a tus evaluaciones y se registrarán de forma segura para certificar tu inducción y mantener informado a tu instructor.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep('landing')}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Comenzar Mi Inducción</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* VIEW 4: AVATAR SELECTION */}
          {activeStep === 'avatar_selection' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Selecciona tu Avatar</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Escoge el avatar que te representará durante tu experiencia de inducción.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar.seed}
                    onClick={() => setSelectedAvatar(avatar.seed)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedAvatar === avatar.seed
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full ${avatar.color} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                      {avatar.name[0]}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{avatar.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(tempRole === 'instructor' ? 'instructor_pin' : 'learner_characterization')}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleAvatarSubmit}
                  className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Confirmar y Comenzar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Servicio Nacional de Aprendizaje SENA • Dirección General</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveStep('instructor_pin')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Acceso Docente
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveStep('learner_characterization')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Caracterización Aprendiz
            </button>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src="/assets/aistudio/2026__4_26_p.m._f9fc5f09.mp4"
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
            />
          </div>
        </div>
      )}

    </div>
  );
};
