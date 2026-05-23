import type { TaskType } from "./Job";
export type CodeTaskType = "write-code" | "fix-code" | "clean-code";

export interface CodeTaskData {
  taskType: string;
  language: string;
  instructions: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  evaluationCriteria: string;
}