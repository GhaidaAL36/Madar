/*i will delete it when api ready */
import { jobs } from "../data/jobsData";

// TODO: swap this with the API version when backend is ready
export function useJob(jobId: string) {
  return jobs.find((j) => j.id === jobId) ?? null;
}
