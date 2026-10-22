export interface LearnerProfile {
  fullName: string;
  documentType: 'CC' | 'TI' | 'PPT' | 'CE';
  documentNumber: string;
  formationProgram: string;
  courseCode: string; // Número de ficha (e.g., 2873612)
  regional: string;
  trainingCenter: string;
  avatarSeed: string;
  completedAt?: string;
}

export type ModuleId = 'identidad' | 'derechos' | 'deberes' | 'etapas' | 'faltas_medidas';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleRef: string;
  points: number;
}

export interface CaseChoice {
  text: string;
  isCorrect: boolean;
  feedback: string;
  regulationImpact: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  scenario: string;
  character: string;
  situation: string;
  choices: CaseChoice[];
  resolutionSummary: string;
}

export interface LessonContent {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  keyPoints: {
    title: string;
    description: string;
    tag?: string;
  }[];
  practicalTip?: string;
}

export interface InductionModule {
  id: ModuleId;
  order: number;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  lessons: LessonContent[];
  questions: QuizQuestion[];
  caseStudy?: CaseStudy;
  passingScore: number; // Percentage, e.g. 80
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'mastery' | 'ethics' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface InductionProgress {
  learner: LearnerProfile;
  completedModules: ModuleId[];
  moduleScores: Record<ModuleId, number>; // Percentage
  totalXp: number;
  streak: number;
  unlockedBadgeIds: string[];
  casesResolved: string[];
  certificateIssued: boolean;
  certificateHash?: string;
  certificateDate?: string;
}

export interface GlossaryItem {
  term: string;
  chapter: string;
  definition: string;
  practicalExample: string;
}

export interface RegulationRuleItem {
  id: string;
  numeral: string;
  category: 'derecho' | 'deber' | 'prohibicion';
  article: string;
  title: string;
  description: string;
  practicalApplication: string;
}

export type UserRole = 'instructor' | 'aprendiz';

export interface ApprenticeRecord {
  id: string;
  timestamp: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  formationProgram: string;
  courseCode: string;
  regional: string;
  trainingCenter: string;
  completedModulesCount: number;
  averageScore: number;
  totalXp: number;
  status: 'Certificado' | 'En Progreso' | 'No Iniciado';
  certificateHash?: string;
  certificateDate?: string;
  lastActivity?: string;
}

export interface InstructorSettings {
  defaultCourseCode: string;
  instructorName: string;
  instructorEmail: string;
  regional: string;
  trainingCenter: string;
  minimumPassingScore: number;
}

