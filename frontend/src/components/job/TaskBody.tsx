import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "../../types/Job";

const LABELS = {
  interactiveTasks: "المهام التفاعلية",
  willLearn: "ما ستتعلمه",
  willDo: "ما ستفعله",
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
        <p className="text-text-muted text-xs mb-4">
          {LABELS.interactiveTasks}
        </p>

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
                <span
                  className={`w-2 h-2 rounded-xl shrink-0 ${
                    isActive ? "bg-teal" : "bg-teal-pale"
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-bg-dark-secondary" : "text-text-muted"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              {isActive && (
                <div className="w-full h-0.5 bg-bg-dark-secondary rounded-full mt-1" />
              )}
            </div>
          );
        })}
      </aside>

      <main className="flex-1 py-10 px-14 flex flex-col gap-8">
        <div className="flex flex-col items-start gap-1 border-b border-teal-pale pb-6">
          <h1 className="text-bg-dark-secondary text-4xl font-bold">
            {activeTask.fullTitle}
          </h1>
        </div>

        <p className="text-bg-dark-secondary text-sm leading-relaxed max-w-3xl">
          {activeTask.description}
        </p>

        <div className="flex flex-col gap-4 max-w-130 w-full">
          <div className="bg-mist rounded-xl p-6">
            <h3 className="text-teal font-semibold text-sm mb-4">
              {LABELS.willLearn}
            </h3>
            <ul className="flex flex-col gap-3">
              {activeTask.willLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-1.5" />
                  <span className="text-bg-dark-secondary text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-sand rounded-xl p-6">
            <h3 className="text-gold font-semibold text-sm mb-4">
              {LABELS.willDo}
            </h3>
            <ul className="flex flex-col gap-3">
              {activeTask.willDo.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  <span className="text-bg-dark-secondary text-sm">{item}</span>
                </li>
              ))}
            </ul>
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
