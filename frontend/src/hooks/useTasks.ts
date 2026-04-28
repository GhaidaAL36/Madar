// delete when api ready
import { jobs } from "../data/jobsData";

export function useTasks(jobId: string) {
  return jobs.find((j) => j.id === jobId)?.tasks ?? [];
}