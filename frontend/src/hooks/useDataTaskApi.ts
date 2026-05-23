import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { DataTaskData } from "../types/DataTask";

interface UseDataTaskResult {
  dataTask: DataTaskData | null;
  loading: boolean;
  error: string | null;
}

export function useDataTask(jobId: string, taskId: string): UseDataTaskResult {
  const [dataTask, setDataTask] = useState<DataTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskId) return;
    taskService
      .getDataTask(jobId, taskId)
      .then((d) => {
        console.log("dataTask response:", JSON.stringify(d, null, 2));
        setDataTask(d);
      })
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, taskId]);

  return { dataTask, loading, error };
}