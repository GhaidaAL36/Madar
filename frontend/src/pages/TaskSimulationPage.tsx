import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTaskSimulation } from "../hooks/useTaskSimulationApi";
import { taskService } from "../services/taskService";
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
  const { task, taskDbId, simulationId, generatedContent, loading, error } = useTaskSimulation(jobId ?? "", taskId ?? "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleSubmitRequest = (answer: string) => {
    setAnswer(answer);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await taskService.submitSimulation(jobId!, taskDbId!, simulationId!, [], {});
    navigate(`/jobs/${jobId}/tasks/${taskId}/review?sim=${simulationId}&task=${taskDbId}`);
  };

  const handleCancel = () => setShowConfirm(false);

  if (loading) return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <p className="text-text-muted text-sm">جارٍ التحميل...</p>
    </div>
  );

  if (error || !task) return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <p className="text-text-muted text-sm">المهمة غير موجودة</p>
    </div>
  );

  const renderTaskArea = () => {
    switch (task.type) {
      case "debug_code":
      case "write_function":
      case "code_review":
      case "performance":
        return (
          <CodeTask
            jobId={jobId!}
            taskDbId={taskDbId!}
            simulationId={simulationId!}
            starterCode={task.starterCode ?? ""}
            instructions={task.instructions ?? ""}
            questions={task.questions ?? []}
            onSubmit={handleSubmitRequest}
          />
        );
      case "clean_data":
      case "build_model":
        return (
          <DataTask
            jobId={jobId!}
            taskDbId={taskDbId!}
            simulationId={simulationId!}
            generatedContent={generatedContent!}
          />
        );
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      <div className="flex flex-col h-screen bg-bg-dark">
        <TaskNavbar onSubmit={() => handleSubmitRequest(answer)} />
        <div className="flex flex-1 overflow-hidden">
          <TaskDetails task={task} />
          {renderTaskArea()}
        </div>
      </div>
    </>
  );
}
