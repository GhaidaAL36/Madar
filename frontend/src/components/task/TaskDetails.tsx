import { useState } from "react";
import type { ReactNode } from "react";
import type { SimulationTask, TaskExpectation, EvaluationCriterion } from "../../types/SimulationTask";

interface Props {
  task: SimulationTask;
}

const LABELS = {
  panelTitle:       "تفاصيل المهمة",
  taskSection:      "المهمة",
  expectSection:    "ما يُتوقع منك",
  criteriaSection:  "معايير التقييم",
  progress:         "التقدم",
} as const;

// ── SectionCard ──────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

function SectionCard({ title, icon, children, defaultOpen = true }: SectionCardProps) {
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
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className="text-text-muted transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-teal-pale">
          {children}
        </div>
      )}
    </div>
  );
}

// ── ExpectationItem ──────────────────────────────────────────────────────────

function ExpectationItem({ exp }: { exp: TaskExpectation }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center border-[1.5px] transition-colors ${
        exp.completed ? "bg-teal border-teal" : "bg-transparent border-teal-pale"
      }`}>
        {exp.completed && (
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-xs leading-relaxed ${exp.completed ? "text-text-primary" : "text-text-muted"}`}>
        {exp.label}
      </span>
    </li>
  );
}

// ── CriterionItem ────────────────────────────────────────────────────────────

function CriterionItem({ criterion }: { criterion: EvaluationCriterion }) {
  return (
    <li className="flex items-center gap-2 text-xs text-text-primary">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-gold" />
      {criterion.label}
    </li>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function TaskDetails({ task }: Props) {
  const completed = task.expectations.filter((e) => e.completed).length;
  const total     = task.expectations.length;
  const progress  = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside
      dir="rtl"
      className="flex flex-col gap-4 h-full overflow-y-auto p-4 bg-bg-light"
      style={{ width: "320px", minWidth: "280px" }}
    >
      {/* Panel heading */}
      <div className="flex items-center justify-end gap-2 pt-1 pb-1">
        <span className="text-sm font-bold tracking-wide text-text-muted">
          {LABELS.panelTitle}
        </span>
      </div>

      {/* Task Card */}
      <SectionCard
        title={LABELS.taskSection}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        }
      >
        <h2 className="text-base font-bold mt-2 mb-1 leading-snug text-text-primary">
          {task.title}
        </h2>
        <p className="text-xs leading-relaxed text-text-muted">
          {task.description}
        </p>
      </SectionCard>

      {/* Expectations Card */}
      <SectionCard
        title={LABELS.expectSection}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        }
      >
        <ul className="flex flex-col gap-2.5 mt-2">
          {task.expectations.map((exp) => (
            <ExpectationItem key={exp.id} exp={exp} />
          ))}
        </ul>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-teal">{LABELS.progress}</span>
            <span className="text-xs text-text-muted">{total} / {completed}</span>
          </div>
          <div className="w-full h-1.25 rounded-full overflow-hidden bg-bg-card-secondary">
            <div
              className="h-full rounded-full bg-teal transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </SectionCard>

      {/* Evaluation Criteria Card */}
      <SectionCard
        title={LABELS.criteriaSection}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        }
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