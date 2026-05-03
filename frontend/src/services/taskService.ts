import api from "./api";
import type { SimulationTask } from "../types/SimulationTask";
import type { CodeTaskData } from "../types/CodeTask";
import type { DataTaskData } from "../types/DataTask";

export const taskService = {
  getTask: async (jobId: string, taskId: string): Promise<SimulationTask> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskId}/simulation`);
    return data;
  },

  getCodeTask: async (jobId: string, taskId: string): Promise<CodeTaskData> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskId}/code`);
    return data;
  },

  getDataTask: async (jobId: string, taskId: string): Promise<DataTaskData> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskId}/data`);
    return data;
  },
};
