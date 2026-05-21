import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "../../types/Job";

const LABELS = {
  interactiveTasks: "المهام التفاعلية",
  startTask: "ابدأ المهمة",
} as const;

interface Props {
  tasks: Task[];
}

const TaskBody = ({ tasks }: Props) => {
  const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id);
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? tasks[0];

  if (!activeTask) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-bg-light flex">

      <aside className="w-55 border-l border-teal-pale bg-bg-light shrink-0 py-8 px-5 flex flex-col gap-1">
        <p className="text-text-muted text-xs mb-4">{LABELS.interactiveTasks}</p>
        {tasks.map((task) => {
          const isActive = task.id === activeTaskId;
          return (
            <div
              key={task.id}
              onClick={() => setActiveTaskId(task.id)}
              className={`flex flex-col items-start gap-0.5 py-3 px-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? "bg-bg-card shadow-sm" : "hover:bg-bg-card/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-xl shrink-0 ${isActive ? "bg-teal" : "bg-teal-pale"}`} />
                <span className={`text-xs font-semibold ${isActive ? "text-bg-dark-secondary" : "text-text-muted"}`}>
                  {task.title}
                </span>
              </div>
              <span className="text-[10px] text-text-muted pr-4">{task.duration}</span>
              {isActive && <div className="w-full h-0.5 bg-bg-dark-secondary rounded-full mt-1" />}
            </div>
          );
        })}
      </aside>

      <main className="flex-1 py-10 px-14 flex flex-col gap-8">
        <div className="flex flex-col items-start gap-1 border-b border-teal-pale pb-6">
          <p className="text-text-muted text-xs">{LABELS.interactiveTasks}</p>
          <h1 className="text-bg-dark-secondary text-4xl font-bold">{activeTask.title}</h1>
          <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
            <span>🕐</span>
            <span>{activeTask.duration}</span>
          </div>
        </div>

        <div className="flex justify-start mt-2">
          <button
            onClick={() => navigate(`/jobs/${jobId}/tasks/${activeTask.id}`)}
            className="cursor-pointer rounded-xl bg-gold-dark px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            {LABELS.startTask}
          </button>
        </div>
      </main>
    </div>
  );
};

export default TaskBody;