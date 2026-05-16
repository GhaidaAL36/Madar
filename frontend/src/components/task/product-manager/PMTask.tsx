import { useState } from "react";
import { useParams } from "react-router-dom";
import type { PMTaskType } from "@/types/PMTask";
import { usePMTask } from "@/hooks/usePMTaskApi";
import CommentsView from "./pmViews/CommentsView";
import DocumentView from "./pmViews/DocumentView";
import UXProblemView from "./pmViews/UXProblemView";
import StakeholderView from "./pmViews/StakeholderView";
import PMAnswerPanel from "./PMAnswerPanel";
import HintsPanel from "../HintsPanel";

const LABELS: Record<PMTaskType, { badge: string; color: string }> = {
  "review-comments": {
    badge: "مراجعة تعليقات",
    color: "bg-red-500/10 text-red-400 border-red-400/25",
  },
  "review-document": {
    badge: "مراجعة وثيقة",
    color: "bg-teal/15 text-teal border-teal/25",
  },
  "ux-problem": {
    badge: "مشكلة UX",
    color: "bg-purple-500/10 text-purple-400 border-purple-400/25",
  },
  "stakeholder-notes": {
    badge: "اجتماع أصحاب المصلحة",
    color: "bg-amber-500/10 text-amber-400 border-amber-400/25",
  },
};

interface Props {
  taskType: PMTaskType;
  onSubmit: (answer: string) => void;
}

export default function PMTask({ taskType, onSubmit }: Props) {
  const { jobId, taskId } = useParams<{ jobId: string; taskId: string }>();
  const { pmTask, loading, error } = usePMTask(jobId ?? "", taskId ?? "", taskType);
  const [answer, setAnswer] = useState("");
  const { badge, color } = LABELS[taskType];

  if (loading) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-text-muted text-sm">
      جارٍ التحميل...
    </div>
  );

  if (error || !pmTask) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-red-400 text-sm">
      {error ?? "فشل تحميل بيانات المهمة"}
    </div>
  );

  const renderContent = () => {
    switch (taskType) {
      case "review-comments":
        return <CommentsView comments={pmTask.comments ?? []} />;
      case "review-document":
        return <DocumentView title={pmTask.documentTitle ?? ""} sections={pmTask.sections ?? []} />;
      case "ux-problem":
        return <UXProblemView description={pmTask.uxDescription ?? ""} userJourney={pmTask.uxUserJourney ?? []} />;
      case "stakeholder-notes":
        return <StakeholderView title={pmTask.documentTitle ?? ""} sections={pmTask.sections ?? []} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-bg-dark overflow-hidden">
      <div
        dir="rtl"
        className="flex items-start gap-4 px-5 py-4 border-b border-white/8 shrink-0"
      >
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 mt-0.5 ${color}`}>
          {badge}
        </span>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">{renderContent()}</div>

      <PMAnswerPanel value={answer} onChange={setAnswer} />

      <HintsPanel hints={pmTask.hints} />
    </div>
  );
}