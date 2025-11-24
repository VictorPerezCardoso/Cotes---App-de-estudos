export interface User {
  email: string;
  name: string;
  password?: string; // Stored in plaintext as per requirements (simulated)
}

export interface Resource {
  title: string;
  url: string;
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
}

export interface QuizResult {
  topic: string;
  score: number;
  totalQuestions: number;
  date: string; // ISO String
}

export interface StudySession {
  id: string;
  topic: string;
  durationSeconds: number;
  startTime: string; // ISO String
  endTime: string; // ISO String
  resources: Resource[];
  quizResult?: QuizResult;
}

export enum ViewState {
  AUTH = 'AUTH',
  HUB = 'HUB',
  QUIZ = 'QUIZ',
  DASHBOARD = 'DASHBOARD',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE'
}

export interface AIQuizResponse {
  questions: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }[];
}
