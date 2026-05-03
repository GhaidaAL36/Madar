export type PMTaskType =
  | "review-comments"
  | "review-document"
  | "ux-problem"
  | "stakeholder-notes";

export interface UserComment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface DocumentSection {
  heading: string;
  body: string;
}

export interface PMTaskData {
  taskType: PMTaskType;
  instructions: string;
  hints: string[];
  comments?: UserComment[];
  documentTitle?: string;
  sections?: DocumentSection[];
  uxDescription?: string;
  uxUserJourney?: string[];
}
