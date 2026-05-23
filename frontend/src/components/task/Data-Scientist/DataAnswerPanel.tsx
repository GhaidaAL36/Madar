import { useState, useRef, useEffect } from "react";
import type { DataProblem, DataReport, ProblemType } from "@/types/DataTask";

const PROBLEM_TYPES: ProblemType[] = [
  "قيمة مفقودة",
  "قيمة خاطئة",
  "صف مكرر",
  "أخرى",
];

const PROBLEM_COLORS: Record<ProblemType, string> = {
  "قيمة مفقودة": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "قيمة خاطئة":  "text-red-400 bg-red-400/10 border-red-400/20",
  "صف مكرر":     "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "أخرى":        "text-text-muted bg-white/5 border-white/10",
};

// ── Reusable custom dropdown ──────────────────────────────────────────────────
function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-bg-dark-secondary border border-white/8 rounded-lg px-3 py-1.5 text-[12px] text-text-on-dark outline-none hover:border-teal/40 transition-colors cursor-pointer"
      >
        <span>{value}</span>
        <i className={`fa-solid fa-chevron-down text-[10px] text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-bg-dark-secondary border border-white/8 rounded-lg overflow-hidden shadow-lg">
          <div className="max-h-40 overflow-y-auto">
            {options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-right px-3 py-2 text-[12px] transition-colors cursor-pointer border-0 block ${
                  opt === value
                    ? "bg-teal/15 text-teal"
                    : "text-text-muted hover:bg-white/5 hover:text-text-on-dark"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  columns: string[];
  rows: Record<string, string | number>[];
  onSubmit: (report: DataReport) => void;
  submitting?: boolean;
}

type Stage = "report" | "review";

let idCounter = 0;
const uid = () => String(++idCounter);

export default function DataAnswerPanel({ columns, rows, onSubmit, submitting }: Props) {
  const [problems, setProblems] = useState<DataProblem[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [stage, setStage] = useState<Stage>("report");

  const rowOptions = rows.map((r) => String(Object.values(r)[0] ?? ""));

  const addProblem = () => {
    setProblems((prev) => [
      ...prev,
      { id: uid(), row: rowOptions[0] ?? "", column: columns[0] ?? "", problemType: "قيمة مفقودة", fix: "" },
    ]);
  };

  const updateProblem = (id: string, field: keyof DataProblem, value: string) => {
    setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
  };

  const canReview = problems.length > 0 && problems.every((p) => p.fix.trim()) && conclusion.trim();

  // ── Review stage ──────────────────────────────────────────────────────────
  if (stage === "review") {
    return (
      <div dir="rtl" className="flex flex-col h-full bg-bg-dark">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 shrink-0">
          <button
            onClick={() => setStage("report")}
            className="text-text-muted hover:text-text-on-dark transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right text-[12px]" />
          </button>
          <span className="text-[11px] font-bold uppercase  text-text-muted">
            مراجعة التقرير
          </span>
          <span className="mr-auto text-[11px] text-text-muted">{problems.length} مشكلة</span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3">
          {problems.map((p, i) => (
            <div key={p.id} className="flex flex-col gap-1 bg-bg-dark-secondary rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-muted">#{i + 1}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PROBLEM_COLORS[p.problemType]}`}>
                  {p.problemType}
                </span>
                <span className="text-[11px] text-text-muted mr-auto">{p.row} ← {p.column}</span>
              </div>
              <p className="text-[12px] text-text-on-dark leading-relaxed">{p.fix}</p>
            </div>
          ))}

          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[11px] font-bold text-text-muted">الاستنتاج النهائي</span>
            <p className="text-[12px] text-text-on-dark bg-bg-dark-secondary rounded-lg px-3 py-2.5 leading-relaxed">
              {conclusion}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/8 shrink-0">
          <button
            onClick={() => onSubmit({ problems, conclusion })}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-bg-dark text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"
          >
            {submitting
              ? <><i className="fa-solid fa-spinner fa-spin text-[11px]" /> جارٍ الإرسال...</>
              : <><i className="fa-solid fa-paper-plane text-[11px]" /> إرسال التقرير</>
            }
          </button>
        </div>
      </div>
    );
  }

  // ── Report stage ──────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="flex flex-col h-full bg-bg-dark">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          تقرير جودة البيانات
        </span>
        {problems.length > 0 && (
          <span className="text-[11px] text-teal">{problems.length} مشكلة مسجّلة</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3">

        {problems.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <i className="fa-solid  text-[20px] text-text-muted/30" />
            <p className="text-[12px] text-text-muted/50 leading-relaxed">
              افحص الجدول وسجّل كل مشكلة تجدها
            </p>
          </div>
        )}

        {problems.map((p, i) => (
          <div key={p.id} className="flex flex-col gap-2 bg-bg-dark-secondary rounded-lg px-3 py-3 border border-white/6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted">مشكلة #{i + 1}</span>
              <button
                onClick={() => removeProblem(p.id)}
                className="text-text-muted/40 hover:text-red-400 transition-colors border-0 bg-transparent cursor-pointer text-[11px]"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Row */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-text-muted">الصف المتأثر</label>
              <Dropdown
                value={p.row}
                options={rowOptions}
                onChange={(v) => updateProblem(p.id, "row", v)}
              />
            </div>

            {/* Column */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-text-muted">العمود المتأثر</label>
              <Dropdown
                value={p.column}
                options={columns}
                onChange={(v) => updateProblem(p.id, "column", v)}
              />
            </div>

            {/* Problem type */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-text-muted">نوع المشكلة</label>
              <div className="flex flex-wrap gap-1.5">
                {PROBLEM_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateProblem(p.id, "problemType", type)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      p.problemType === type
                        ? PROBLEM_COLORS[type]
                        : "text-text-muted/50 bg-transparent border-white/8 hover:border-white/20"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Fix */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-text-muted">الحل المقترح</label>
              <textarea
                value={p.fix}
                onChange={(e) => updateProblem(p.id, "fix", e.target.value)}
                placeholder="كيف تعالج هذه المشكلة؟"
                rows={2}
                className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-2.5 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addProblem}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-white/15 hover:border-teal/40 text-[12px] text-text-muted hover:text-teal transition-all cursor-pointer bg-transparent"
        >
          <i className="fa-solid fa-plus text-[11px]" />
          أضف مشكلة
        </button>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[11px] font-bold text-text-muted">الاستنتاج النهائي</label>
          <p className="text-[10px] text-text-muted/50 mb-1">
            هل البيانات جاهزة للتحليل؟ ما مدى خطورة المشاكل التي وجدتها؟
          </p>
          <textarea
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            placeholder="اكتب استنتاجك النهائي هنا..."
            rows={3}
            className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-3 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
          />
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/8 shrink-0">
        <button
          onClick={() => setStage("review")}
          disabled={!canReview}
          className="w-full flex items-center justify-center gap-2 bg-teal/15 hover:bg-teal/25 disabled:opacity-30 disabled:cursor-not-allowed text-teal text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"
        >
          <i className="fa-solid  text-[11px]" />
          مراجعة التقرير
        </button>
      </div>
    </div>
  );
}