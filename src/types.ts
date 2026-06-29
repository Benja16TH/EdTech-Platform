export type CourseLevel = 'Básico' | 'Intermedio' | 'Avanzado';
export type CourseStatus = 'active' | 'inactive';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  learningObjectives: string[];
  status: CourseStatus;
  thumbnail: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  videoUrl?: string;
}

export interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: Date;
  courseCompleted?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'collaborator' | 'admin';
  password?: string;
  active?: boolean;
  position?: string;
  department?: string;
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface CourseAssignment {
  id: string;
  userId: string;
  courseId: string;
  assignedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_course' | 'reminder' | 'completed' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  courseId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  orderIndex: number;
}

export interface FinalAssessment {
  id: string;
  courseId: string;
  passingPercentage: number;
  questions: AssessmentQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAssessmentAttempt {
  id: string;
  userId: string;
  courseId: string;
  answers: number[];
  score: number;
  passed: boolean;
  attemptedAt: Date;
}

export interface Analytics {
  totalCollaborators: number;
  completedCourses: number;
  inProgressCourses: number;
  completionRate: number;
  totalHours: number;
  coursesByCategory: { category: string; count: number }[];
  monthlyProgress: { month: string; completed: number; enrolled: number }[];
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issueDate: Date;
  certificateNumber: string;
}

export type ActivityAction =
  | 'user_created'
  | 'user_updated'
  | 'course_assigned'
  | 'course_completed'
  | 'assessment_passed'
  | 'certificate_generated';

export interface ActivityLog {
  id: string;
  userId: string | null;
  action: ActivityAction;
  description: string;
  createdAt: Date;
}