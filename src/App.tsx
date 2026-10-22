import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  InductionProgress,
  InductionModule,
  LearnerProfile,
  ModuleId,
  UserRole,
  ApprenticeRecord
} from './types/induction';
import { DEFAULT_LEARNER, INDUCTION_MODULES, SENA_BADGES } from './data/senaData';
import { INITIAL_MOCK_APPRENTICES } from './data/mockApprentices';
import { Header } from './components/Header';
import { InductionRoadmap } from './components/InductionRoadmap';
import { ModuleStudyView } from './components/ModuleStudyView';
import { GamifiedQuizView } from './components/GamifiedQuizView';
import { CaseStudySimulator } from './components/CaseStudySimulator';
import { CertificateView } from './components/CertificateView';
import { LearnerProfileModal } from './components/LearnerProfileModal';
import { StructuredPlanModal } from './components/StructuredPlanModal';
import { RegulationsSearch } from './components/RegulationsSearch';
import { BadgesModal } from './components/BadgesModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { InstructorAuthModal } from './components/InstructorAuthModal';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { soundEngine } from './utils/soundEffects';
import { User } from 'firebase/auth';
import { initAuth, getAccessToken } from './services/firebaseAuth';
import {
  getCachedSpreadsheet,
  syncLearnerProgress,
  fetchApprenticesFromSheet,
  SpreadsheetInfo
} from './services/googleSheetsService';
import { ShieldCheck, GraduationCap, ArrowLeftRight } from 'lucide-react';

const STORAGE_KEY = 'sena_induction_progress_v2';
const THEME_STORAGE_KEY = 'sena_theme_mode';
const ROLE_STORAGE_KEY = 'sena_active_role';
const SESSION_ROLE_KEY = 'sena_session_role_v3';

export default function App() {
  // Theme state (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Screen transition blur flag for theme switch
  const [isBlurTransitioning, setIsBlurTransitioning] = useState<boolean>(false);

  // Sync dark mode class on root element and localStorage
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  // Current Role State (Instructor vs Aprendiz)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roleQuery = urlParams.get('role');
      if (roleQuery === 'aprendiz' || roleQuery === 'instructor') {
        return roleQuery;
      }
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'instructor' || savedRole === 'aprendiz') {
        return savedRole;
      }
    } catch {
      // ignore
    }
    return 'instructor';
  });

  // Active Session Screen: 'landing' (role portal) vs 'instructor' vs 'aprendiz'
  const [activeSessionRole, setActiveSessionRole] = useState<'landing' | 'instructor' | 'aprendiz'>(() => {
    try {
      const savedSession = sessionStorage.getItem(SESSION_ROLE_KEY);
      if (savedSession === 'instructor' || savedSession === 'aprendiz') {
        return savedSession;
      }
    } catch {
      // ignore
    }
    return 'landing';
  });

  // Check URL parameter for initial role selection on landing page
  const initialRoleChoice = (() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      if (roleParam === 'aprendiz' || roleParam === 'instructor') {
        return roleParam;
      }
    } catch {
      // ignore
    }
    return null;
  })();

  // Load or initialize progress
  const [progress, setProgress] = useState<InductionProgress>(() => {
    let initialLearner = DEFAULT_LEARNER;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const fichaQuery = urlParams.get('ficha');
      if (fichaQuery) {
        initialLearner = { ...DEFAULT_LEARNER, courseCode: fichaQuery };
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: InductionProgress = JSON.parse(saved);
        if (fichaQuery) {
          parsed.learner.courseCode = fichaQuery;
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    return {
      learner: initialLearner,
      completedModules: [],
      moduleScores: {} as Record<ModuleId, number>,
      totalXp: 120, // Initial welcome bonus
      streak: 0,
      unlockedBadgeIds: [],
      casesResolved: [],
      certificateIssued: false
    };
  });

  // Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Current apprentice view state
  const [currentView, setCurrentView] = useState<'roadmap' | 'study' | 'quiz' | 'case' | 'certificate'>('roadmap');
  const [activeModule, setActiveModule] = useState<InductionModule>(INDUCTION_MODULES[0]);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isDriveSyncOpen, setIsDriveSyncOpen] = useState(false);
  const [isInstructorAuthOpen, setIsInstructorAuthOpen] = useState(false);

  // Google Workspace Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Auto-sync status and active spreadsheet reference
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [activeSpreadsheet, setActiveSpreadsheet] = useState<SpreadsheetInfo | null>(() => getCachedSpreadsheet());
  const isSyncingRef = useRef(false);

  // Apprentices list for Instructor Dashboard
  const [apprenticesList, setApprenticesList] = useState<ApprenticeRecord[]>(INITIAL_MOCK_APPRENTICES);

  // Inspected Apprentice Certificate (for instructor viewing student certificate)
  const [inspectedCertificate, setInspectedCertificate] = useState<{
    learner: LearnerProfile;
    certHash: string;
    certDate: string;
    totalXp: number;
    averageScore: number;
  } | null>(null);

  // Save current role to localStorage and active session
  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    setActiveSessionRole(role);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      sessionStorage.setItem(SESSION_ROLE_KEY, role);
    } catch {
      // ignore
    }
    soundEngine.playCorrect();
  };

  // Instructor authenticated via password Sena1234
  const handleInstructorAuthenticated = (avatar: string) => {
    setCurrentRole('instructor');
    setActiveSessionRole('instructor');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'instructor');
      sessionStorage.setItem(SESSION_ROLE_KEY, 'instructor');
      // Potential: store avatar somewhere for instructor
    } catch {
      // ignore
    }
    soundEngine.playCorrect();
  };

  // Aprendiz completed characterization (no password required)
  const handleLearnerCharacterized = (characterizedLearner: LearnerProfile, avatar: string) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        learner: { ...characterizedLearner, avatarSeed: avatar }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setCurrentRole('aprendiz');
    setActiveSessionRole('aprendiz');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'aprendiz');
      sessionStorage.setItem(SESSION_ROLE_KEY, 'aprendiz');
    } catch {
      // ignore
    }
    soundEngine.playCorrect();
  };

  // Return to role selection landing page
  const handleReturnToLanding = () => {
    setActiveSessionRole('landing');
    try {
      sessionStorage.removeItem(SESSION_ROLE_KEY);
    } catch {
      // ignore
    }
    soundEngine.playCorrect();
  };

  // Automatic background synchronization to Google Sheets
  const triggerAutoSync = useCallback(async (currentProgress: InductionProgress) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        return;
      }

      if (isSyncingRef.current) {
        return;
      }
      isSyncingRef.current = true;
      setSyncStatus('syncing');

      const result = await syncLearnerProgress(token, currentProgress);
      setActiveSpreadsheet(result.spreadsheet);
      const timeStr = new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastSyncTime(timeStr);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Auto-sync en segundo plano omitido o fallido:', err);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  // Fetch apprentice records from Google Sheets for Instructor Dashboard
  const handleRefreshApprenticesFromSheet = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token || !activeSpreadsheet?.id) {
        setIsDriveSyncOpen(true);
        return;
      }

      setSyncStatus('syncing');
      const rows = await fetchApprenticesFromSheet(token, activeSpreadsheet.id);

      if (rows && rows.length > 0) {
        const converted: ApprenticeRecord[] = rows.map((r, idx) => ({
          id: `sheet-row-${idx}-${r.documentNumber}`,
          timestamp: r.timestamp || new Date().toLocaleTimeString('es-CO'),
          documentType: r.documentType,
          documentNumber: r.documentNumber,
          fullName: r.fullName,
          formationProgram: r.formationProgram,
          courseCode: r.courseCode,
          regional: r.regional,
          trainingCenter: r.trainingCenter,
          completedModulesCount: r.completedModulesCount,
          averageScore: r.averageScore,
          totalXp: r.totalXp,
          status: r.status === 'Certificado' ? 'Certificado' : 'En Progreso',
          certificateHash: r.certificateHash,
          certificateDate: r.certificateDate,
          lastActivity: r.timestamp || 'Registrado'
        }));

        // Merge with existing mock records, deduplicating by documentNumber
        setApprenticesList((prev) => {
          const sheetDocMap = new Map(converted.map((c) => [c.documentNumber, c]));
          const untouchedMocks = prev.filter((m) => !sheetDocMap.has(m.documentNumber));
          return [...converted, ...untouchedMocks];
        });
      }

      setSyncStatus('synced');
      soundEngine.playCorrect();
    } catch (error) {
      console.error('Error refrescando aprendices desde Google Sheets:', error);
      setSyncStatus('error');
    }
  }, [activeSpreadsheet]);

  // Initialize Firebase Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // When user logs in, immediately perform initial background sync
  useEffect(() => {
    if (currentUser) {
      triggerAutoSync(progress);
    }
  }, [currentUser, triggerAutoSync]);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Dark Mode Toggle with screen blur transition
  const handleToggleDarkMode = () => {
    setIsBlurTransitioning(true);
    setIsDarkMode((prev) => !prev);
    soundEngine.playCorrect();

    setTimeout(() => {
      setIsBlurTransitioning(false);
    }, 550);
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setSoundEnabled(next);
  };

  // Profile update handler with background auto-sync
  const handleSaveProfile = (updatedLearner: LearnerProfile) => {
    const nextProgress: InductionProgress = {
      ...progress,
      learner: updatedLearner
    };
    setProgress(nextProgress);
    triggerAutoSync(nextProgress);
  };

  // Module selection
  const handleSelectModule = (mod: InductionModule) => {
    setActiveModule(mod);
    setCurrentView('study');
  };

  // Start quiz from study
  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  // Start case study from study
  const handleStartCase = () => {
    setCurrentView('case');
  };

  // Quiz completion handler
  const handleQuizComplete = (scorePercentage: number, earnedXp: number) => {
    const isPassed = scorePercentage >= activeModule.passingScore;
    const moduleId = activeModule.id;

    setProgress((prev) => {
      const alreadyCompleted = prev.completedModules.includes(moduleId);
      const nextCompletedModules = isPassed && !alreadyCompleted
        ? [...prev.completedModules, moduleId]
        : prev.completedModules;

      const nextScores = {
        ...prev.moduleScores,
        [moduleId]: Math.max(scorePercentage, prev.moduleScores[moduleId] || 0)
      };

      // Check badges to unlock
      const nextBadgeIds = [...prev.unlockedBadgeIds];
      const badgeMap: Record<ModuleId, string> = {
        identidad: 'badge_escudo',
        derechos: 'badge_derechos',
        deberes: 'badge_reglamento',
        etapas: 'badge_etapas',
        faltas_medidas: 'badge_comite'
      };

      if (isPassed && badgeMap[moduleId] && !nextBadgeIds.includes(badgeMap[moduleId])) {
        nextBadgeIds.push(badgeMap[moduleId]);
      }

      // Check if all 5 modules completed
      const allModulesDone = nextCompletedModules.length === INDUCTION_MODULES.length;
      let certIssued = prev.certificateIssued;
      let certHash = prev.certificateHash;
      let certDate = prev.certificateDate;

      if (allModulesDone) {
        if (!nextBadgeIds.includes('badge_induccion_completa')) {
          nextBadgeIds.push('badge_induccion_completa');
        }
        certIssued = true;
        if (!certHash) {
          const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
          certHash = `SENA-IND-2026-F${prev.learner.courseCode}-${randHex}`;
          const now = new Date();
          certDate = now.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }

      const nextProgress: InductionProgress = {
        ...prev,
        completedModules: nextCompletedModules,
        moduleScores: nextScores,
        totalXp: prev.totalXp + earnedXp,
        unlockedBadgeIds: nextBadgeIds,
        certificateIssued: certIssued,
        certificateHash: certHash,
        certificateDate: certDate
      };

      // Background non-blocking auto sync to Google Sheets
      triggerAutoSync(nextProgress);

      return nextProgress;
    });

    setCurrentView('roadmap');
  };

  // Case study completion handler
  const handleCaseComplete = (earnedXp: number) => {
    setProgress((prev) => {
      const caseId = activeModule.caseStudy?.id || 'case_unknown';
      const cases = prev.casesResolved.includes(caseId)
        ? prev.casesResolved
        : [...prev.casesResolved, caseId];

      const nextBadgeIds = [...prev.unlockedBadgeIds];
      if (!nextBadgeIds.includes('badge_comite')) {
        nextBadgeIds.push('badge_comite');
      }

      const nextProgress: InductionProgress = {
        ...prev,
        casesResolved: cases,
        totalXp: prev.totalXp + earnedXp,
        unlockedBadgeIds: nextBadgeIds
      };

      // Background non-blocking auto sync to Google Sheets
      triggerAutoSync(nextProgress);

      return nextProgress;
    });

    setCurrentView('study');
  };

  // Reset Progress function for demonstration/replay
  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar el progreso de este aprendiz para volver a realizar las evaluaciones?')) {
      const freshProgress: InductionProgress = {
        learner: progress.learner,
        completedModules: [],
        moduleScores: {} as Record<ModuleId, number>,
        totalXp: 120,
        streak: 0,
        unlockedBadgeIds: [],
        casesResolved: [],
        certificateIssued: false
      };
      setProgress(freshProgress);
      triggerAutoSync(freshProgress);
      setCurrentView('roadmap');
    }
  };

  // Demo auto-complete for rapid preview
  const handleAutoCompleteDemo = () => {
    const allIds = INDUCTION_MODULES.map((m) => m.id);
    const mockScores: Record<ModuleId, number> = {
      identidad: 100,
      derechos: 100,
      deberes: 95,
      etapas: 100,
      faltas_medidas: 90
    };
    const allBadges = SENA_BADGES.map((b) => b.id);
    const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const certHash = `SENA-IND-2026-F${progress.learner.courseCode}-${randHex}`;
    const certDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const nextProgress: InductionProgress = {
      ...progress,
      completedModules: allIds,
      moduleScores: mockScores,
      totalXp: 850,
      streak: 5,
      unlockedBadgeIds: allBadges,
      casesResolved: ['caso_derechos', 'caso_deberes', 'caso_comite'],
      certificateIssued: true,
      certificateHash: certHash,
      certificateDate: certDate
    };

    setProgress(nextProgress);
    triggerAutoSync(nextProgress);
    if (currentRole === 'aprendiz') {
      setCurrentView('certificate');
    }
  };

  // Inspect learner certificate from Instructor Dashboard
  const handleInspectLearnerCertificate = (
    learner: LearnerProfile,
    certHash?: string,
    certDate?: string
  ) => {
    setInspectedCertificate({
      learner,
      certHash: certHash || `SENA-IND-2026-F${learner.courseCode}-OFFICIAL`,
      certDate: certDate || new Date().toLocaleDateString('es-CO'),
      totalXp: 850,
      averageScore: 96
    });
  };

  // Compute average score of active learner
  const scoresArray = Object.values(progress.moduleScores);
  const averageScore = scoresArray.length > 0
    ? Math.round(scoresArray.reduce((acc, curr) => acc + curr, 0) / scoresArray.length)
    : 100;

  // If no active session or role selection landing page is requested
  if (activeSessionRole === 'landing') {
    return (
      <RoleSelectionLanding
        onSelectInstructor={(avatar) => handleInstructorAuthenticated(avatar)}
        onSelectLearner={(learnerData, avatar) => handleLearnerCharacterized(learnerData, avatar)}
        currentLearner={progress.learner}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        initialRoleChoice={initialRoleChoice}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#090d16] flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-400 relative ${
        isBlurTransitioning ? 'screen-blur-active' : ''
      }`}
    >
      {/* Luminous Ambient Blur Overlay when in Dark Mode */}
      {isDarkMode && <div className="dark-blur-screen-overlay no-print" aria-hidden="true" />}

      {/* Top Header adapted per role */}
      <Header
        currentRole={currentRole}
        onSwitchToInstructor={() => setIsInstructorAuthOpen(true)}
        onSwitchToLearner={() => handleSetRole('aprendiz')}
        onReturnToLanding={handleReturnToLanding}
        learner={progress.learner}
        totalXp={progress.totalXp}
        streak={progress.streak}
        unlockedBadgesCount={progress.unlockedBadgeIds.length}
        totalBadgesCount={SENA_BADGES.length}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPlan={() => setIsPlanOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenCertificate={() => setCurrentView('certificate')}
        hasCertificate={progress.certificateIssued}
        onOpenDriveSync={currentRole === 'instructor' ? () => setIsDriveSyncOpen(true) : undefined}
        isDriveConnected={Boolean(currentUser)}
        sheetUrl={activeSpreadsheet?.webViewLink}
        instructorEmail={currentUser?.email || undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        
        {/* If viewing an inspected certificate from Instructor Dashboard */}
        {inspectedCertificate ? (
          <CertificateView
            learner={inspectedCertificate.learner}
            totalXp={inspectedCertificate.totalXp}
            averageScore={inspectedCertificate.averageScore}
            completedDate={inspectedCertificate.certDate}
            certificateHash={inspectedCertificate.certHash}
            onBack={() => setInspectedCertificate(null)}
          />
        ) : currentRole === 'instructor' ? (
          /* ============================================== */
          /* INSTRUCTOR DASHBOARD VIEW                      */
          /* ============================================== */
          <InstructorDashboard
            currentUser={currentUser}
            spreadsheetInfo={activeSpreadsheet}
            apprentices={apprenticesList}
            activeLearnerProgress={progress}
            syncStatus={syncStatus}
            lastSyncTime={lastSyncTime}
            onOpenDriveModal={() => setIsDriveSyncOpen(true)}
            onRefreshDataFromSheet={handleRefreshApprenticesFromSheet}
            onSwitchToLearnerView={() => handleSetRole('aprendiz')}
            onInspectLearnerCertificate={handleInspectLearnerCertificate}
            onSimulateLearnerCompletion={handleAutoCompleteDemo}
            onResetLearnerProgress={handleResetProgress}
          />
        ) : (
          /* ============================================== */
          /* APRENDIZ INDUCTION EXPERIENCE                  */
          /* ============================================== */
          <>
            {currentView === 'roadmap' && (
              <InductionRoadmap
                progress={progress}
                onSelectModule={handleSelectModule}
                onOpenCertificate={() => setCurrentView('certificate')}
                onOpenPlan={() => setIsPlanOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                /* Note: onOpenDriveSync is omitted in apprentice mode to keep UI completely clean */
              />
            )}

            {currentView === 'study' && (
              <ModuleStudyView
                module={activeModule}
                onBack={() => setCurrentView('roadmap')}
                onStartQuiz={handleStartQuiz}
                onStartCaseStudy={activeModule.caseStudy ? handleStartCase : undefined}
                hasCaseStudy={Boolean(activeModule.caseStudy)}
                score={progress.moduleScores[activeModule.id]}
              />
            )}

            {currentView === 'quiz' && (
              <GamifiedQuizView
                module={activeModule}
                onComplete={handleQuizComplete}
                onBackToStudy={() => setCurrentView('study')}
              />
            )}

            {currentView === 'case' && activeModule.caseStudy && (
              <CaseStudySimulator
                caseStudy={activeModule.caseStudy}
                onBack={() => setCurrentView('study')}
                onCompleteCase={handleCaseComplete}
              />
            )}

            {currentView === 'certificate' && (
              <CertificateView
                learner={progress.learner}
                totalXp={progress.totalXp}
                averageScore={averageScore}
                completedDate={progress.certificateDate || new Date().toLocaleDateString('es-CO')}
                certificateHash={progress.certificateHash || `SENA-IND-2026-F${progress.learner.courseCode}-8A39F7`}
                onBack={() => setCurrentView('roadmap')}
              />
            )}
          </>
        )}
      </main>

      {/* Role-Segregated Footer */}
      <footer className="no-print bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3 px-4 text-xs text-slate-500 dark:text-slate-400 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">
              Servicio Nacional de Aprendizaje SENA • Dirección General • Inducción Acuerdo 007 de 2012
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReturnToLanding}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium flex items-center gap-1 transition-colors"
              title="Cambiar de rol o regresar al portal institucional"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Portal de Roles</span>
            </button>

            {currentRole === 'instructor' ? (
              <button
                onClick={() => handleSetRole('aprendiz')}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Vista Aprendiz</span>
              </button>
            ) : (
              <button
                onClick={() => setIsInstructorAuthOpen(true)}
                className="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
                title="Acceso restringido para instructores"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Acceso Instructor</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LearnerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        learner={progress.learner}
        onSave={handleSaveProfile}
      />

      <StructuredPlanModal
        isOpen={isPlanOpen}
        onClose={() => setIsPlanOpen(false)}
        onStartInduction={() => {
          setIsPlanOpen(false);
          setCurrentView('roadmap');
        }}
      />

      <RegulationsSearch
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        unlockedBadgeIds={progress.unlockedBadgeIds}
      />

      {/* Google Sheets Sync & Drive Records Manager (Accessible by Instructor) */}
      <GoogleSheetsSyncModal
        isOpen={isDriveSyncOpen}
        onClose={() => setIsDriveSyncOpen(false)}
        progress={progress}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onSpreadsheetLoaded={(sheet) => {
          setActiveSpreadsheet(sheet);
          setSyncStatus('synced');
        }}
      />

      {/* Instructor PIN / Auth Dialog */}
      <InstructorAuthModal
        isOpen={isInstructorAuthOpen}
        onClose={() => setIsInstructorAuthOpen(false)}
        onSuccess={() => {
          setIsInstructorAuthOpen(false);
          handleInstructorAuthenticated('');
        }}
        currentUserEmail={currentUser?.email}
      />

    </div>
  );
}
