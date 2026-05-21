import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PMTaskType } from "@/types/PMTask";
import { usePMTask } from "@/hooks/usePMTaskApi";
import CommentsView from "./pmViews/CommentsView";
import DocumentView from "./pmViews/DocumentView";
import UXProblemView from "./pmViews/UXProblemView";
import StakeholderView from "./pmViews/StakeholderView";
import HintsPanel from "../HintsPanel";
import { taskService } from "@/services/taskService";
import AnswerPanel from "../AnswerPanel";
import "@/style/scrollbar.css"

const LABELS: Record<PMTaskType, { badge: string; color: string }> = {
  "review_comments": {
    badge: "مراجعة تعليقات",
    color: "bg-red-500/10 text-red-400 border-red-400/25",
  },
  "review_document": {
    badge: "مراجعة وثيقة",
    color: "bg-teal/15 text-teal border-teal/25",
  },
  "ux_problem": {
    badge: "مشكلة UX",
    color: "bg-purple-500/10 text-purple-400 border-purple-400/25",
  },
  "stakeholder_notes": {
    badge: "اجتماع أصحاب المصلحة",
    color: "bg-amber-500/10 text-amber-400 border-amber-400/25",
  },
};

interface Props {
  taskType: PMTaskType;
  jobId: string;
  taskDbId: number;
  simulationId: string;
  onSubmit: (answers: Record<number, string>) => void;
  submitting?: boolean;
}

export default function PMTask({ taskType, jobId, taskDbId, simulationId }: Props) {
  const navigate = useNavigate();
  const { pmTask, loading, error } = usePMTask(jobId, String(taskDbId), taskType);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (answers: Record<number, string>) => {
    if (!pmTask) return;
    setSubmitting(true);
    try {
      await taskService.submitSimulation(jobId, String(taskDbId), simulationId, {
        questions: pmTask.questions ?? [],
        user_answers: answers,
      });
      navigate(`/jobs/${jobId}/tasks/${taskDbId}/review?sim=${simulationId}&task=${taskDbId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (taskType) {
      case "review_comments":
        return <CommentsView comments={pmTask.comments ?? []} />;
      case "review_document":
        return <DocumentView title={pmTask.documentTitle ?? ""} sections={pmTask.sections ?? []} />;
      case "ux_problem":
        return <UXProblemView description={pmTask.uxDescription ?? ""} userJourney={pmTask.uxUserJourney ?? []} />;
      case "stakeholder_notes":
        return <StakeholderView title={pmTask.documentTitle ?? ""} sections={pmTask.sections ?? []} />;
    }
  };

  return (
    <div className="flex flex-1 h-full bg-bg-dark overflow-hidden custom-scrollbar">

      <div className="flex flex-col flex-1 min-w-0 border-l border-white/8 overflow-hidden">
        <div dir="rtl" className="flex items-center gap-3 px-5 py-3 border-b border-white/8 shrink-0">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${color}`}>
            {badge}
          </span>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          {renderContent()}
        </div>
      </div>

      <div className="flex flex-col w-96 shrink-0 h-full overflow-hidden border-r border-white/8">
        <AnswerPanel
          questions={pmTask.questions ?? []}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>

    </div>
  );
}