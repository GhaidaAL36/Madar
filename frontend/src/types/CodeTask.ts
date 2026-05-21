import type { TaskType } from "./Job";
export type CodeTaskType = "write-code" | "fix-code" | "clean-code";

export interface CodeTaskData {
  taskType: TaskType;
  language: string;
  instructions: string;
  starterCode: string;
  hints: string[];
  expectedOutput: string;
}