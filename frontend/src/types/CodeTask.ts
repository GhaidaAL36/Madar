export type CodeTaskType = "write-code" | "fix-code" | "clean-code";

export interface CodeTaskQuestion {
  id: number;
  question: string;
  choices: string[];
  correct_answer: string;
}

export interface CodeTaskData {
  taskDbId: number;
  title: string;
  description: string;
  language: string;
  instructions: string;
  starterCode: string;
  estimatedTime: string;
  questions: CodeTaskQuestion[];
  columns?: string[];
  rows?: Record<string, string | number | null>[];
  scenario?: string;
}