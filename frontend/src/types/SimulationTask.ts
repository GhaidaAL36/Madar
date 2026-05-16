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
  job_id: string;
  type: TaskType;
  title: string;
  full_title: string;
  duration: string;
  time_range: string;
  description: string;
  will_learn: string[];
  will_do: string[];
  expectations: TaskExpectation[];
  evaluation_criteria: EvaluationCriterion[];
  content: Record<string, any>;
}