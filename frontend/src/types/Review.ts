export interface AnswerReviewItem {
  id: number;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface Review {
  score: number;
  fitPercent: number;
  fitSummary: string;
  skills: any[];
  strengths: any[];
  improvements: any[];
  detailedFeedback: string[];
  answerReview: AnswerReviewItem[];
}

export interface ReviewContext {
  review: Review;
  jobTitleAr: string;
  taskTitle: string;
  taskDuration: string;
}