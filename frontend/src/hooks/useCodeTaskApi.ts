import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { CodeTaskData } from "../types/CodeTask";

const TASK_TYPE_MAP: Record<string, string> = {
  "debug_code":    "debug_code",
  "write_function":"write_function",
  "code_review":   "code_review",
  "requirements":  "requirements",
  "performance":   "performance",
  "clean_data":    "clean_data",
  "build_model":   "build_model",
};

interface UseCodeTaskResult {
  codeTask: CodeTaskData | null;
  loading: boolean;
  error: string | null;
}

export function useCodeTask(jobId: string, aiTaskId: string): UseCodeTaskResult {
  const [codeTask, setCodeTask] = useState<CodeTaskData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !aiTaskId) return;
    taskService
      .generateTask(jobId, aiTaskId)
      .then(setCodeTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, aiTaskId]);

  return { codeTask, loading, error };
}