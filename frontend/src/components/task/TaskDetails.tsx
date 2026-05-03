import { useState } from "react";
import type { ReactNode } from "react";
import type {
  SimulationTask,
  TaskExpectation,
  EvaluationCriterion,
} from "@/types/SimulationTask";

const LABELS = {
  panelTitle: "تفاصيل المهمة",
  taskSection: "المهمة",
  expectSection: "ما يُتوقع منك",
  criteriaSection: "معايير التقييم",
  progress: "التقدم",
} as const;

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl overflow-hidden bg-bg-card border border-teal-pale">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-bg-card border-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-teal">{icon}</span>
          <span className="text-sm font-bold text-text-primary">{title}</span>
        </div>
        <i className={`fa-solid ${open ? "fa-angle-up" : "fa-angle-down"}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-teal-pale">
          {children}
        </div>
      )}
    </div>
  );
}

interface ExpectationItemProps {
  exp: TaskExpectation;
  onToggle: (id: string) => void;
}

function ExpectationItem({ exp, onToggle }: ExpectationItemProps) {
  return (
    <li
      className="flex items-start gap-2.5 cursor-pointer group"
      onClick={() => onToggle(exp.id)}
    >
      <span
        className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center border-[1.5px] transition-colors group-hover:border-teal ${
          exp.completed
            ? "bg-teal border-teal"
            : "bg-transparent border-teal-pale"
        }`}
      >
        {exp.completed && (
          <i className="fa-solid fa-check text-white text-[8px]" />
        )}
      </span>
      <span
        className={`text-xs leading-relaxed select-none ${
          exp.completed
            ? "text-text-primary line-through opacity-60"
            : "text-text-muted"
        }`}
      >
        {exp.label}
      </span>
    </li>
  );
}

function CriterionItem({ criterion }: { criterion: EvaluationCriterion }) {
  return (
    <li className="flex items-center gap-2 text-xs text-text-primary">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-gold" />
      {criterion.label}
    </li>
  );
}

interface Props {
  task: SimulationTask;
}

export default function TaskDetails({ task }: Props) {
  const [expectations, setExpectations] = useState<TaskExpectation[]>(
    task.expectations.map((e) => ({ ...e, completed: false })),
  );

  const toggle = (id: string) => {
    setExpectations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)),
    );
  };

  const completed = expectations.filter((e) => e.completed).length;
  const total = expectations.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside
      className="flex flex-col gap-4 h-full overflow-y-auto p-4 bg-bg-light"
      style={{ width: "320px", minWidth: "280px" }}
    >
      <div className="flex items-center justify-end gap-2 pt-1 pb-1">
        <span className="text-sm font-bold tracking-wide text-text-muted">
          {LABELS.panelTitle}
        </span>
      </div>

      <SectionCard
        title={LABELS.taskSection}
        icon={<i className="fa-regular fa-square-check" />}
      >
        <h2 className="text-base font-bold mt-2 mb-1 leading-snug text-text-primary">
          {task.title}
        </h2>
        <p className="text-xs leading-relaxed text-text-muted">
          {task.fullDescription}
        </p>
      </SectionCard>

      <SectionCard
        title={LABELS.expectSection}
        icon={<i className="fa-solid fa-list-check" />}
      >
        <ul className="flex flex-col gap-2.5 mt-2">
          {expectations.map((exp) => (
            <ExpectationItem key={exp.id} exp={exp} onToggle={toggle} />
          ))}
        </ul>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-teal">
              {LABELS.progress}
            </span>
            <span className="text-xs text-text-muted">
              {completed} / {total}
            </span>
          </div>
          <div className="w-full h-1.25 rounded-full overflow-hidden bg-bg-card-secondary">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={LABELS.criteriaSection}
        icon={<i className="fa-solid fa-list-ul" />}
      >
        <ul className="flex flex-col gap-2 mt-2">
          {task.evaluationCriteria.map((criterion) => (
            <CriterionItem key={criterion.id} criterion={criterion} />
          ))}
        </ul>
      </SectionCard>
    </aside>
  );
}
