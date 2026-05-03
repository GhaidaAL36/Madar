export type TaskType = "write-code" | "fix-code" | "clean-code" | "analyze-data";

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
  id: number;
  type: TaskType;
  title: string;
  duration: string;
  fullTitle: string;
  timeRange: string;
  description: string;
  willLearn: string[];
  willDo: string[];
}