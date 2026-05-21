export type PMTaskType =
  | "review_comments"
  | "review_document"
  | "ux_problem"
  | "stakeholder_notes";

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
  questions?: { id: number; question: string }[];
  context?: string;
}