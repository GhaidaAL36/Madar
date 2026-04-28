import { useEffect, useState } from "react";
import { jobService } from "../services/jobService";
import type { Job } from "../types/Job";

interface UseJobResult {
  job: Job | null;
  loading: boolean;
  error: string | null;
}

export function useJob(id: string): UseJobResult {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    jobService
      .getById(id)
      .then(setJob)
      .catch(() => setError("فشل تحميل بيانات الوظيفة"))
      .finally(() => setLoading(false));
  }, [id]);

  return { job, loading, error };
}
