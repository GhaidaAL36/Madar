import { useEffect, useState } from "react";
import { jobService } from "../services/jobService";
import type { Job } from "../types/Job";

interface UseJobsResult {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

export function useJobs(): UseJobsResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    jobService
      .getAll()
      .then(setJobs)
      .catch(() => setError("فشل تحميل الوظائف"))
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading, error };
}
