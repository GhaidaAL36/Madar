import api from "./api";
import type { ReviewContext } from "../types/Review";

export const reviewService = {
  getReview: async (jobId: string, taskDbId: string, simulationId: string): Promise<ReviewContext> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskDbId}/simulations/${simulationId}/review`);
    return data;
  },
};