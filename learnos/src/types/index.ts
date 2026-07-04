export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  userId: string;
  isArchived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  subjectId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  topicId: string;
  order: number;
  durationMinutes: number | null;
  difficulty: number | null;
  isCompleted: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'ordering';

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  content: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  topicId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string | null;
  topicId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId: string | null;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart: Date | null;
  actualEnd: Date | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, unknown>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}