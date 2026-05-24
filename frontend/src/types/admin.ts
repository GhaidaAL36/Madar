export type AdminSection = "dashboard" | "jobs" | "simulations" | "users";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export interface AdminSimulationUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminSimulation {
  simulationId: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  jobId: string | null;
  jobTitleAr: string;
  taskTitle: string;
  taskType: string;
  taskDbId: number | null;
  score: number | null;
  fitPercent: number | null;
  user: AdminSimulationUser | null;
}