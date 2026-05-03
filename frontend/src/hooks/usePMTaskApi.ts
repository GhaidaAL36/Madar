import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { PMTaskData, PMTaskType } from "../types/PMTask";

interface UsePMTaskResult {
  pmTask: PMTaskData | null;
  loading: boolean;
  error: string | null;
}

export function usePMTask(jobId: string, taskId: string, taskType: PMTaskType): UsePMTaskResult {
  const [pmTask, setPmTask]   = useState<PMTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskId) return;
    taskService
      .getPMTask(jobId, taskId)
      .then(setPmTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, taskId, taskType]);

  return { pmTask, loading, error };
}