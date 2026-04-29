export interface SkillRating {
  label: string;
  value: number;
  color: "teal" | "gold";
}

export interface AnswerBlock {
  title: string;
  items: { text: string; correct: boolean }[];
}

export interface Review {
  score: number;
  fitPercent: number;
  fitSummary: string;
  skills: SkillRating[];
  strengths: string[];
  improvements: string[];
  detailedFeedback: string[];
  answerReview: AnswerBlock[];
}

export interface ReviewContext {
  review: Review;
  jobTitleAr: string;
  taskTitle: string;
  taskDuration: string;
}