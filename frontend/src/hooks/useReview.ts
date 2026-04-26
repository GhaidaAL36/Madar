import { dummyReview } from "../data/reviewData";
import { jobs } from "../data/jobsData";
import type { ReviewData } from "../types/Review";

export function useReview(jobId: string, taskId: number) {
  const job = jobs.find((j) => j.id === jobId);
  const task = job?.tasks.find((t) => t.id === taskId);

  return {
    review: dummyReview as ReviewData,
    jobTitleAr: job?.titleAr ?? "المهنة",
    taskTitle: task?.fullTitle ?? "المهمة",
    taskDuration: task?.timeRange ?? "",
  };
}