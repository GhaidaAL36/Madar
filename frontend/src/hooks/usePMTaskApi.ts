import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { PMTaskData, PMTaskType } from "../types/PMTask";

interface UsePMTaskResult {
  pmTask: PMTaskData | null;
  loading: boolean;
  error: string | null;
}

export function usePMTask(jobId: string, taskDbId: string, taskType: PMTaskType) {
  const [pmTask, setPmTask] = useState<PMTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskDbId) return;
    taskService.getPMTask(jobId, taskDbId).then(setPmTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, taskDbId]);

  return { pmTask, loading, error };
}