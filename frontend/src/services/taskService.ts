import api from "./api";
import type { SimulationTask } from "../types/SimulationTask";
import type { CodeTaskData } from "../types/CodeTask";
import type { DataTaskData } from "../types/DataTask";
import type { PMTaskData } from "../types/PMTask";

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

  getPMTask: async (jobId: string, taskId: string): Promise<PMTaskData> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskId}`);
    return {
      taskType: data.type,
      instructions: data.description,
      hints: data.will_learn ?? [],
      documentTitle: data.full_title,
      sections: data.content?.sections ?? [],
      comments: data.content?.comments ?? [],
      uxDescription: data.content?.ux_description ?? "",
      uxUserJourney: data.content?.ux_user_journey ?? [],
    };
  },

  createSimulation: async (jobId: string, taskId: string): Promise<{ id: string; status: string; started_at: string }> => {
    const { data } = await api.post(`/jobs/${jobId}/tasks/${taskId}/simulations`, {});
    return data;
  },

  getSimulation: async (jobId: string, taskId: string, simulationId: string): Promise<{ simulation: any; task: SimulationTask }> => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskId}/simulations/${simulationId}`);
    return data;
  },

  submitSimulation: async (jobId: string, taskId: string, simulationId: string, answer: string) => {
    const { data } = await api.post(
      `/jobs/${jobId}/tasks/${taskId}/simulations/${simulationId}/submit`,
      { answer }
    );
    return data;
  },
};