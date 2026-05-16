import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTaskSimulation } from "../hooks/useTaskSimulationApi";
import type { CodeTaskType } from "../types/Job";
import type { PMTaskType } from "../types/PMTask";
import TaskNavbar from "../components/task/TaskNavbar";
import TaskDetails from "../components/task/TaskDetails";
import CodeTask from "../components/task/Software-Engineer/CodeTask";
import DataTask from "../components/task/Data-Scientist/DataTask";
import PMTask from "../components/task/product-manager/PMTask";
import ConfirmModal from "../components/task/ConfirmModal";

export default function TaskSimulationPage() {
  const navigate = useNavigate();
  const { jobId, taskId } = useParams<{ jobId: string; taskId: string }>();
  const { task, simulationId, loading, error } = useTaskSimulation(jobId ?? "", taskId ?? "");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmitRequest = () => setShowConfirm(true);
  const handleConfirm = () => {
    setShowConfirm(false);
    navigate(`/jobs/${jobId}/tasks/${taskId}/review`);
  };
  const handleCancel = () => setShowConfirm(false);

  if (loading)
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <p className="text-text-muted text-sm">جارٍ التحميل...</p>
      </div>
    );

  if (error || !task)
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <p className="text-text-muted text-sm">المهمة غير موجودة</p>
      </div>
    );

    

  const renderTaskArea = () => {
    console.log("task.type:", task.type);
    switch (task.type) {
      // Software Engineer 
      case "write-code":
      case "fix-code":
      case "clean-code":
        return (
          <CodeTask
            taskType={task.type as CodeTaskType}
            onSubmit={handleSubmitRequest}
          />
        );

      // Data Scientist 
      case "analyze-data":
        return <DataTask />;

      // Product Manager 
      case "review-comments":
      case "review-document":
      case "ux-problem":
      case "stakeholder-notes":
        return (
          <PMTask
            taskType={task.type as PMTaskType}
            onSubmit={handleSubmitRequest}
          />
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-text-muted text-sm">نوع المهمة غير مدعوم</p>
          </div>
        );
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      <div className="flex flex-col h-screen bg-bg-dark">
        <TaskNavbar onSubmit={handleSubmitRequest} />
        <div className="flex flex-1 overflow-hidden">
          <TaskDetails task={task} />
          {renderTaskArea()}
        </div>
      </div>
    </>
  );
}
