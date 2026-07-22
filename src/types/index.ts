export type CourseCategory = 'Informática' | 'Mobile' | 'Sociedade' | 'Programação' | 'Design';
export type CourseLevel = 'Nível Básico' | 'Nível Intermediário' | 'Nível Avançado';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type?: 'multiple' | 'short';
  options?: QuizOption[];
  correctAnswer: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  videoUrl?: string;
  description: string;
  topicsCovered: string[];
  instructorName?: string;
  instructorRole?: string;
  instructorAvatar?: string;
  quickQuestions?: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  description: string;
  workloadHours: number;
  thumbnail: string;
  progressPercent: number; // 0 to 100
  isEnrolled: boolean;
  modules: Module[];
  finalExam: {
    id: string;
    title: string;
    durationMinutes: number;
    passPercentage: number; // 70
    questions: QuizQuestion[];
  };
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  workloadHours: number;
  grade: number; // e.g. 9.8
  competencies: string[];
  verificationCode: string;
  studentName: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontScale: number; // 1 to 1.4
  vlibrasActive: boolean;
  audioDescription: boolean;
}
