export type CodeTaskType = "write-code" | "debug-code" | "code-review";

export interface CodeTaskData {
  taskType: string;
  language: string;
  instructions: string;
  starterCode: string;
  buggyCode: string;
  expectedOutput: string;
  failingTestCases: string;
  hints: string[];
  evaluationCriteria: string;
  codeToReview: string;
  reviewChecklist: string[];
  reviewFocusLabel: string;
  expectedIssues: any[];
}