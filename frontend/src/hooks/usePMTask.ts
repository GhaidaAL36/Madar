// delete
import { getPMTaskData } from "../data/Pmtasksdata";
import type { PMTaskData, PMTaskType } from "../types/PMTask";

export function usePMTask(taskType: PMTaskType): PMTaskData {
  return getPMTaskData(taskType);
}