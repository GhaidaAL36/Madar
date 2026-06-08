import type { TaskType } from "./Job";

export interface TaskExpectation {
  id: string;
  label: string;
  completed: boolean;
}

export interface EvaluationCriterion {
  id: string;
  label: string;
}

export interface SimulationTask {
  id: number;
  type: string;
  title: string;
  description: string;
  expectations: TaskExpectation[];
  evaluation_criteria: EvaluationCriterion[];
  starterCode?: string;
  instructions?: string;
}

