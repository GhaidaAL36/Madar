// when api is ready
import { useEffect, useState } from "react";
import { jobService } from "../services/jobService";
import type { Task } from "../types/Job";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useTasks(jobId: string): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    jobService
      .getTasks(jobId)
      .then(setTasks)
      .catch(() => setError("فشل تحميل المهام"))
      .finally(() => setLoading(false));
  }, [jobId]);

  return { tasks, loading, error };
}
