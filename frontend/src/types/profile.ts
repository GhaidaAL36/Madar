export interface Profile {
  userId: string;
  name: string;
  email: string;
  interests: string[];
}

export interface SimulationHistory {
  simulationId: string;
  completedAt: string;
  jobId: string | null;
  jobTitleAr: string;
  taskTitle: string;
  taskType: string;
  taskDbId: number | null;
  score: number | null;
  fitPercent: number | null;
}