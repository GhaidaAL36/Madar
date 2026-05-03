import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { CodeTaskData } from "../types/CodeTask";
import type { TaskType } from "../types/Job";

interface UseCodeTaskResult {
  codeTask: CodeTaskData | null;
  loading: boolean;
  error: string | null;
}

export function useCodeTask(jobId: string, taskId: string, taskType: TaskType): UseCodeTaskResult {
  const [codeTask, setCodeTask] = useState<CodeTaskData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskId) return;
    taskService
      .getCodeTask(jobId, taskId)
      .then(setCodeTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, taskId, taskType]);

  return { codeTask, loading, error };
}