// useCodeTask.ts
import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { CodeTaskData } from "../types/CodeTask";
import type { CodeTaskType } from "../types/CodeTask";

interface UseCodeTaskResult {
  codeTask: CodeTaskData | null;
  loading: boolean;
  error: string | null;
}

export function useCodeTask(
  jobId: string,
  taskId: string,
  taskType: CodeTaskType  // kept for API symmetry but not in dep array
): UseCodeTaskResult {
  const [codeTask, setCodeTask] = useState<CodeTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskId) return;
    setLoading(true);
    setError(null);
    taskService
      .getCodeTask(jobId, taskId)
      .then(setCodeTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, taskId]); // taskType intentionally excluded — doesn't affect the fetch

  return { codeTask, loading, error };
}