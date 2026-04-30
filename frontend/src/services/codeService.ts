import api from "./api";

export const codeService = {
  run: async (jobId: string, taskId: string, code: string): Promise<string> => {
    const { data } = await api.post(`/jobs/${jobId}/tasks/${taskId}/run`, {
      code,
    });
    return data.output;
  },
};
