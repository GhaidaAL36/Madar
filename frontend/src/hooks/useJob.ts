/*i will delete it when api ready */
import { jobs } from "../data/jobsData";

export function useJob(jobId: string) {
  return jobs.find((j) => j.id === jobId) ?? null;
}
