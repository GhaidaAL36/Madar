import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { SimulationTask } from "../types/SimulationTask";

interface UseTaskSimulationResult {
  task: SimulationTask | null;
  loading: boolean;
  error: string | null;
}

export function useTaskSimulation(jobId: string, taskId: string): UseTaskSimulationResult {
  const [task, setTask]       = useState<SimulationTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskId) return;
    taskService
      .getTask(jobId, taskId)
      .then(setTask)
      .catch(() => setError("فشل تحميل بيانات المهمة"))
      .finally(() => setLoading(false));
  }, [jobId, taskId]);

  return { task, loading, error };
}