import type { CodeTaskType } from "../types/CodeTask";
import type { CodeTaskData } from "../types/CodeTask";
import { getCodeTaskData } from "../data/codeTasksData";

export function useCodeTask(taskType: CodeTaskType): CodeTaskData {
  return getCodeTaskData(taskType);
}