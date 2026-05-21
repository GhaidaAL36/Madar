import api from "./api";
import type { CodeTaskData, CodeTaskQuestion } from "../types/CodeTask";

export const taskService = {

  generateTask: async (jobId: string, aiTaskId: string): Promise<CodeTaskData> => {
  const { data } = await api.post(`/ai/task`, { job_id: jobId, task_id: aiTaskId });
  return {
    taskDbId:     data.id,
    title:        data.title,
    description:  data.description,
    language:     "python",
    instructions: data.content.instructions ?? "",
    starterCode:  data.content.code_snippet ?? "",
    estimatedTime:data.content.estimated_time ?? "",
    questions:    data.content.questions ?? [],
    columns:      data.content.table_columns ?? [],
    rows:         data.content.table ?? [],
    scenario:     data.content.scenario ?? null,
  };
},

  generateDataTask: async (jobId: string, aiTaskId: string): Promise<DataTaskData> => {
    const { data } = await api.post(`/ai/task`, { job_id: jobId, task_id: aiTaskId });
    return {
      taskDbId: data.id,
      title: data.title,
      description: data.description,
      instructions: data.content.instructions,
      columns: data.content.table_columns ?? [],
      rows: data.content.table ?? [],
      scenario: data.content.scenario ?? null,
      questions: data.content.questions ?? [],
    };
  },

  createSimulation: async (jobId: string, taskDbId: number): Promise<{ id: string }> => {
    const { data } = await api.post(`/jobs/${jobId}/tasks/${taskDbId}/simulations`, {});
    return data;
  },

  getSimulation: async (jobId: string, taskDbId: number, simulationId: string) => {
    const { data } = await api.get(`/jobs/${jobId}/tasks/${taskDbId}/simulations/${simulationId}`);
    return data;
  },

  submitSimulation: async (
    jobId: string,
    taskDbId: number,
    simulationId: string,
    questions: CodeTaskQuestion[],
    userAnswers: Record<string, string>
  ) => {
    const { data } = await api.post(
      `/jobs/${jobId}/tasks/${taskDbId}/simulations/${simulationId}/submit`,
      { questions, user_answers: userAnswers }
    );
    return data;
  },

  getReview: async (jobId: string, taskDbId: number, simulationId: string) => {
    const { data } = await api.get(
      `/jobs/${jobId}/tasks/${taskDbId}/simulations/${simulationId}/review`
    );
    return data;
  },
};