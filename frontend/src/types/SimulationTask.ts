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
  id: string;
  type: TaskType;
  title: string;
  fullDescription: string;
  expectations: TaskExpectation[];
  evaluationCriteria: EvaluationCriterion[];
}