import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { DataTaskData } from "../types/DataTask";

interface UseDataTaskResult {
  dataTask: DataTaskData | null;
  loading: boolean;
  error: string | null;
}

export function useDataTask(jobId: string, aiTaskId: string): UseDataTaskResult {
  const [dataTask, setDataTask] = useState<DataTaskData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !aiTaskId) return;
    taskService
      .generateDataTask(jobId, aiTaskId)
      .then(setDataTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, aiTaskId]);

  return { dataTask, loading, error };
}