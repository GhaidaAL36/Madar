export type CodeTaskType = "write-code" | "fix-code" | "clean-code";
export type DataTaskType = "analyze-data";
export type PMTaskType   = "review-comments" | "review-document" | "ux-problem" | "stakeholder-notes";

export type TaskType = CodeTaskType | DataTaskType | PMTaskType;

export interface Job {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  descriptionPrimary: string;
  descriptionSecondary: string;
  skills: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  duration: string;
  fullTitle: string;
  timeRange: string;
  description: string;
  willLearn: string[];
  willDo: string[];
}