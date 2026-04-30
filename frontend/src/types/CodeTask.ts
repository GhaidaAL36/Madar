import type { TaskType } from "./Job";

export interface CodeTaskData {
  taskType: TaskType;
  language: string;
  instructions: string;
  starterCode: string;
  hints: string[];
  expectedOutput: string;
}