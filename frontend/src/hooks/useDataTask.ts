// delte
import { getDataTaskData } from "../data/dataTasksData";
import type { DataTaskData } from "../types/DataTask";

export function useDataTask(): DataTaskData {
  return getDataTaskData();
}