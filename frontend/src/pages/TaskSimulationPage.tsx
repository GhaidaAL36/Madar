import { useParams } from "react-router-dom";
import { useTaskSimulation } from "../hooks/useTaskSimulation";
import TaskNavbar from "../components/task/TaskNavbar";
import TaskDetails from "../components/task/TaskDetails";
import { useTimer } from "../hooks/useTimer";

export default function TaskSimulationPage() {
  const { id, taskId } = useParams<{ id: string; taskId: string }>();
  const task = useTaskSimulation(id ?? "", taskId ?? "");
  const timeLeft = useTimer(872);

  if (!task) return null;

  return (
    <div dir="rtl" className="flex flex-col h-screen bg-bg-dark-secondary">
      <TaskNavbar timeLeft={timeLeft} />

      <div className="flex flex-1 overflow-hidden">
        {/* Task area — swap with <EmailTask /> <CodeTask /> etc */}
        <main className="flex-1 overflow-auto p-4 bg-bg-dark">
          <p className="text-text-on-dark/30 text-sm text-center mt-20">
            منطقة المهمة
          </p>
        </main>

        <TaskDetails task={task} />
      </div>
    </div>
  );
}