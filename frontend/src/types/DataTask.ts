export interface DataTaskQuestion {
  id: number;
  question: string;
  choices: string[];
  correct_answer: string;
}

export interface DataTaskData {
  taskDbId: number;
  title: string;
  description: string;
  instructions: string;
  columns: string[];
  rows: Record<string, string | number | null>[];
  scenario?: string;       // only for build_model
  questions: DataTaskQuestion[];
}