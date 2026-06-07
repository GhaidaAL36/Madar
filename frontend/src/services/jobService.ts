import api from "./api";
import type { Job, Task, TaskType } from "../types/Job";

export const jobService = {
  getAll: async (): Promise<Job[]> => {
    const { data } = await api.get("/jobs");
    return data.map((job: any) => ({
      id: job.id,
      icon: job.icon,
      titleAr: job.title_ar,
      titleEn: job.title_en,
      descriptionPrimary: job.description_primary,
      descriptionSecondary: job.description_secondary,
      skills: job.skills,
      tasks: [],
    }));
  },

  getById: async (id: string): Promise<Job> => {
    const { data } = await api.get(`/jobs/${id}`);
    return {
      id: data.id,
      icon: data.icon,
      titleAr: data.title_ar,
      titleEn: data.title_en,
      descriptionPrimary: data.description_primary,
      descriptionSecondary: data.description_secondary,
      skills: data.skills,
      tasks: [],
    };
  },

  getTasks: async (jobId: string): Promise<Task[]> => {
    const { data } = await api.get(`/ai/jobs/${jobId}`);
    return data.tasks.map((task: any) => ({
      id: task.id,           
      type: task.id.replace(/_/g, "-") as TaskType,         
      title: task.title,
      fullTitle: task.title,
      duration: task.duration,
      timeRange: task.duration,
      description: "",
      willLearn: [],
      willDo: [],
    }));
  },
};
