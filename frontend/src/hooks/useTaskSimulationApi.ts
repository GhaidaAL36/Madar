import { useEffect, useRef, useState } from "react";
import { taskService } from "../services/taskService";
import type { SimulationTask } from "../types/SimulationTask";
import type { CodeTaskData } from "../types/CodeTask";

interface UseTaskSimulationResult {
  task: SimulationTask | null;
  taskDbId: number | null;
  simulationId: string | null;
  generatedContent: CodeTaskData | null;
  loading: boolean;
  error: string | null;
}

export function useTaskSimulation(jobId: string, aiTaskId: string): UseTaskSimulationResult {
  const [task, setTask] = useState<SimulationTask | null>(null);
  const [taskDbIdState, setTaskDbId] = useState<number | null>(null);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<CodeTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!jobId || !aiTaskId) return;
    if (calledRef.current) return;
    calledRef.current = true;

    taskService
      .generateTask(jobId, aiTaskId)
      .then((codeTask) => {
        setTaskDbId(codeTask.taskDbId);
        setGeneratedContent(codeTask);
        return taskService.createSimulation(jobId, codeTask.taskDbId)
          .then(({ id: simId }) => {
            setSimulationId(simId);
            return taskService.getSimulation(jobId, codeTask.taskDbId, simId)
              .then(({ task }) => {
                setTask({
                  ...task,
                  expectations: (task.expectations ?? []).map((e: any, i: number) =>
                    typeof e === "string" ? { id: String(i), label: e, completed: false } : e
                  ),
                  evaluation_criteria: (task.evaluation_criteria ?? []).map((c: any, i: number) =>
                    typeof c === "string" ? { id: String(i), label: c } : c
                  ),
                  starterCode: codeTask.starterCode,
                  instructions: codeTask.instructions,
                  questions: codeTask.questions,
                });
              });
          });
      })
      .catch((err) => {
        console.error("Simulation error:", err);
        setError("فشل تحميل بيانات المهمة");
      })
      .finally(() => setLoading(false));
  }, [jobId, aiTaskId]);

  return { task, taskDbId: taskDbIdState, simulationId, generatedContent, loading, error };
}