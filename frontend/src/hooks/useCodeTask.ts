import { getCodeTaskData } from "../data/codeTasksData";
import type { CodeTaskData } from "../types/CodeTask";
import type { TaskType } from "../types/Job";

export function useCodeTask(taskType: TaskType): CodeTaskData {
  return getCodeTaskData(taskType);
}