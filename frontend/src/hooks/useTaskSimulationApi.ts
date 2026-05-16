import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import type { SimulationTask } from "../types/SimulationTask";

interface UseTaskSimulationResult {
  task: SimulationTask | null;
  simulationId: string | null;
  loading: boolean;
  error: string | null;
}

export function useTaskSimulation(jobId: string, taskId: string): UseTaskSimulationResult {
  const [task, setTask]               = useState<SimulationTask | null>(null);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    console.log("jobId:", jobId, "taskId:", taskId);
    if (!jobId || !taskId) return;
    taskService
      .createSimulation(jobId, taskId)
      .then(({ id }) => {
        setSimulationId(id);
        return taskService.getSimulation(jobId, taskId, id);
      })
      .then(({ task }) => {
        const normalized = {
          ...task,
          expectations: task.expectations.map((e: any, i: number) =>
            typeof e === "string" ? { id: String(i), label: e, completed: false } : e
          ),
          evaluation_criteria: task.evaluation_criteria.map((c: any, i: number) =>
            typeof c === "string" ? { id: String(i), label: c } : c
          ),
        };
        setTask(normalized);
      })
      .catch((err) => {
      console.error("Simulation error:", err);
      setError("فشل تحميل بيانات المهمة");
    })
      .finally(() => setLoading(false));
  }, [jobId, taskId]);

  return { task, simulationId, loading, error };
}