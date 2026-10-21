/**
 * Learning and Lesson state machine types for Excel Akademi AI
 */

import type { Worksheet, Workbook, CellCoordinate } from '../spreadsheet/types.ts';

export type LessonStepStatus =
  | 'explanation'
  | 'example'
  | 'instruction'
  | 'waiting_for_student'
  | 'validating'
  | 'success'
  | 'retry'
  | 'completed';

export interface TaskValidationResult {
  isValid: boolean;
  message: string;
  hint?: string;
  expectedValue?: string | number;
}

export interface TaskStep {
  id: string;
  taskNumber: number;
  title: string;
  instruction: string;
  hint: string;
  narrationText: string;
  targetCell?: string; // e.g. "B7"
  validate: (sheet: Worksheet, activeCell: CellCoordinate) => TaskValidationResult;
}

export interface LessonSolvedExample {
  title: string;
  scenario: string;
  dataSnippet: Array<{ label: string; value: string }>;
  formula: string;
  result: string;
  explanation: string;
  steps: string[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  category: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  estimatedMinutes: number;
  description: string;
  learningObjective: string;
  explanationContent: {
    overview: string;
    syntax: string;
    parameters: Array<{ name: string; description: string; required: boolean }>;
    bestPractices: string[];
    commonMistakes: string[];
  };
  solvedExample: LessonSolvedExample;
  tasks: TaskStep[];
  summary: string[];
  initialWorkbookFactory: () => Workbook;
}

export interface UserLessonProgress {
  lessonId: string;
  completed: boolean;
  currentTaskIndex: number;
  completedTasks: string[];
  lastStudiedAt: string;
  score?: number;
}

export interface OverallLearningProgress {
  totalCompletedLessons: number;
  totalTimeSpentMinutes: number;
  dailyGoalMinutes: number;
  dailyMinutesCompleted: number;
  lastLessonId: string;
  recommendedLessonId: string;
  lessonProgress: Record<string, UserLessonProgress>;
}
