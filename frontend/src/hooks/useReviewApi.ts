import { useEffect, useState } from "react";
import { reviewService } from "@/services/reviewService";
import type { ReviewContext } from "../types/Review";

interface UseReviewResult {
  data: ReviewContext | null;
  loading: boolean;
  error: string | null;
}

export function useReview(jobId: string, taskDbId: string, simulationId: string): UseReviewResult {
  const [data, setData]       = useState<ReviewContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskDbId || !simulationId) return;
    reviewService
      .getReview(jobId, taskDbId, simulationId)
      .then(setData)
      .catch(() => setError("فشل تحميل نتائج التقييم"))
      .finally(() => setLoading(false));
  }, [jobId, taskDbId, simulationId]);

  return { data, loading, error };
}