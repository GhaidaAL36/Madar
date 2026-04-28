import api from "./api";
import type { Job } from "../types/Job";

export const jobService = {
  getAll: async (): Promise<Job[]> => {
    const { data } = await api.get("/jobs");
    return data;
  },

  getById: async (id: string): Promise<Job> => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },
};