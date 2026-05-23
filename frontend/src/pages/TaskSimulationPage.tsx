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
        return <DataTask jobId={jobId!} taskDbId={taskDbId!} simulationId={simulationId!} generatedContent={generatedContent!} taskType="clean_data" />;

      case "data_analyst":
        return <DataTask jobId={jobId!} taskDbId={taskDbId!} simulationId={simulationId!} generatedContent={generatedContent!} taskType="data_analyst" />;
      case "review_comments":
      case "review_document":
      case "ux_problem":
      case "stakeholder_notes":
        return (
          <PMTask
            taskType={task.type as PMTaskType}
            jobId={jobId!}
            taskDbId={taskDbId!}
            simulationId={simulationId!} onSubmit={function (answers: Record<number, string>): void {
              throw new Error("Function not implemented.");
            }} />
        );
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-bg-dark">
        <TaskNavbar />
        <div className="flex flex-1 overflow-hidden">
          <TaskDetails task={task} />
          {renderTaskArea()}
        </div>
      </div>
    </>
  );
}
