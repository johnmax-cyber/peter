export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  user_id: string;
  is_archived: boolean;
  "order": number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  subject_id: string;
  "order": number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  topic_id: string;
  "order": number;
  duration_minutes: number | null;
  difficulty: number | null;
  is_completed: boolean;
  is_bookmarked: boolean;
  created_at: string;
  updated_at: string;
  version: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'ordering';

export interface Question {
  id: string;
  quiz_id: string;
  type: QuestionType;
  content: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  "order": number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  subject_id: string;
  "order": number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number | null;
  started_at: string;
  completed_at: string | null;
  answers: unknown;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string | null;
  topic_id: string;
  "order": number;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string | null;
  topic_id: string | null;
  scheduled_start: string;
  scheduled_end: string;
  actual_start: string | null;
  actual_end: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
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
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}