import api from "./api";
import type { ReviewContext } from "../types/Review";

export const reviewService = {
  getReview: async (jobId: string, taskId: number): Promise<ReviewContext> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskId}/review`);
    return data;
  },
};