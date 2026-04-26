export interface SkillRating {
  label: string;
  value: number;
  color: "#2E7D8C" | "#C4922A";
}

export interface AnswerReviewBlock {
  title: string;
  items: { text: string; correct: boolean }[];
}

export interface ReviewData {
  score: number;
  timeMinutes: number;
  taskIndex: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string[];
  answerReview: AnswerReviewBlock[];
  skills: SkillRating[];
  fitPercent: number;
  fitSummary: string;
}