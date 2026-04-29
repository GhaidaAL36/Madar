import { useEffect, useState } from "react";
import { reviewService } from "../services/reviewService";
import type { ReviewContext } from "../types/Review";

interface UseReviewResult {
  data: ReviewContext | null;
  loading: boolean;
  error: string | null;
}

export function useReview(jobId: string, taskId: number): UseReviewResult {
  const [data, setData]       = useState<ReviewContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !taskId) return;
    reviewService
      .getReview(jobId, taskId)
      .then(setData)
      .catch(() => setError("فشل تحميل نتائج التقييم"))
      .finally(() => setLoading(false));
  }, [jobId, taskId]);

  return { data, loading, error };
}