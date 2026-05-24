import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useCodeTask } from "@/hooks/useCodeTaskApi";
import HintsPanel from "../HintsPanel";

export interface ReviewIssue {
  id: string;
  problem: string;
  reason: string;
  suggestion: string;
}

export interface CodeReviewReport {
  issues: ReviewIssue[];
  summary: string;
}

interface Props {
  jobId: string;
  taskDbId: number;
  simulationId: string;
  onSubmit: (report: CodeReviewReport) => void;
  submitting?: boolean;
}

type Stage = "review" | "preview";

let idCounter = 0;
const uid = () => String(++idCounter);

export default function CodeReviewTask({ jobId, taskDbId, onSubmit, submitting }: Props) {
  const { codeTask, loading, error } = useCodeTask(jobId, String(taskDbId), "fix-code");
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [summary, setSummary] = useState("");
  const [stage, setStage] = useState<Stage>("review");
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});

  const addIssue = () => {
    setIssues((prev) => [...prev, { id: uid(), problem: "", reason: "", suggestion: "" }]);
  };

  const updateIssue = (id: string, field: keyof ReviewIssue, value: string) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const removeIssue = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
  };

  const canPreview =
    issues.length > 0 &&
    issues.every((i) => i.problem.trim() && i.reason.trim()) &&
    summary.trim();

  if (loading) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-text-muted text-sm">
      جارٍ التحميل...
    </div>
  );

  if (error || !codeTask) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-red-400 text-sm">
      {error ?? "فشل تحميل بيانات المهمة"}
    </div>
  );

  // ── Preview stage ─────────────────────────────────────────────────────────
  if (stage === "preview") {
    return (
      <div dir="rtl" className="flex flex-col h-full bg-bg-dark">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 shrink-0">
          <button
            onClick={() => setStage("review")}
            className="text-text-muted hover:text-text-on-dark transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right text-[12px]" />
          </button>
          <span className="text-[11px] font-bold text-text-muted">مراجعة التقرير</span>
          <span className="mr-auto text-[11px] text-text-muted">{issues.length} ملاحظة</span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3">
          {issues.map((issue, i) => (
            <div key={issue.id} className="flex flex-col gap-1.5 bg-bg-dark-secondary rounded-lg px-3 py-2.5">
              <span className="text-[11px] font-bold text-text-muted">ملاحظة #{i + 1}</span>
              <p className="text-[12px] text-text-on-dark leading-relaxed">
                <span className="text-text-muted text-[10px]">المشكلة: </span>{issue.problem}
              </p>
              <p className="text-[12px] text-text-on-dark leading-relaxed">
                <span className="text-text-muted text-[10px]">السبب: </span>{issue.reason}
              </p>
              {issue.suggestion && (
                <p className="text-[12px] text-text-on-dark leading-relaxed">
                  <span className="text-text-muted text-[10px]">الاقتراح: </span>{issue.suggestion}
                </p>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[11px] font-bold text-text-muted">الملخص النهائي</span>
            <p className="text-[12px] text-text-on-dark bg-bg-dark-secondary rounded-lg px-3 py-2.5 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/8 shrink-0">
          <button
            onClick={() => onSubmit({ issues, summary })}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-bg-dark text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"
          >
            {submitting
              ? <><i className="fa-solid fa-spinner fa-spin text-[11px]" /> جارٍ الإرسال...</>
              : <><i className="fa-solid fa-paper-plane text-[11px]" /> إرسال المراجعة</>
            }
          </button>
        </div>
      </div>
    );
  }

  // ── Review stage ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-1 h-full bg-bg-dark overflow-hidden">

      {/* Left: read-only code editor */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Read-only editor */}
        <div className="flex-1 overflow-hidden" dir="ltr">
          <Editor
            height="100%"
            language={codeTask.language}
            value={codeTask.codeToReview}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "line",
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              tabSize: 4,
              automaticLayout: true,
            }}
          />
        </div>

        <HintsPanel hints={codeTask.reviewChecklist} />
      </div>

      {/* Right: review form */}
      <div className="flex flex-col w-96 shrink-0 border-l border-white/8 overflow-hidden bg-bg-dark">

        {/* Header */}
        <div dir="rtl" className="flex items-center justify-between px-5 py-3 border-b border-white/8 shrink-0">
          <span className="text-[11px] font-bold text-text-muted">تقرير المراجعة</span>
          {issues.length > 0 && (
            <span className="text-[11px] text-teal">{issues.length} ملاحظة</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3">

          {/* Empty state */}
          {issues.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <i className="fa-solid fa-magnifying-glass-code text-[20px] text-text-muted/30" />
              <p className="text-[12px] text-text-muted/50 leading-relaxed">
                اقرأ الكود وسجّل كل مشكلة تجدها
              </p>
            </div>
          )}

          {/* Issue cards */}
          {issues.map((issue, i) => (
            <div key={issue.id} dir="rtl" className="flex flex-col gap-2 bg-bg-dark-secondary rounded-lg px-3 py-3 border border-white/6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-muted">ملاحظة #{i + 1}</span>
                <button
                  onClick={() => removeIssue(issue.id)}
                  className="text-text-muted/40 hover:text-red-400 transition-colors border-0 bg-transparent cursor-pointer text-[11px]"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted">المشكلة *</label>
                <textarea
                  value={issue.problem}
                  onChange={(e) => updateIssue(issue.id, "problem", e.target.value)}
                  placeholder="ما هي المشكلة التي لاحظتها؟"
                  rows={2}
                  className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-2.5 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted">السبب *</label>
                <textarea
                  value={issue.reason}
                  onChange={(e) => updateIssue(issue.id, "reason", e.target.value)}
                  placeholder="لماذا هذه مشكلة؟"
                  rows={2}
                  className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-2.5 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted">الاقتراح</label>
                <textarea
                  value={issue.suggestion}
                  onChange={(e) => updateIssue(issue.id, "suggestion", e.target.value)}
                  placeholder="كيف تقترح إصلاحها؟"
                  rows={2}
                  className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-2.5 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
                />
              </div>
            </div>
          ))}

          {/* Add issue */}
          <button
            onClick={addIssue}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-white/15 hover:border-teal/40 text-[12px] text-text-muted hover:text-teal transition-all cursor-pointer bg-transparent"
          >
            <i className="fa-solid fa-plus text-[11px]" />
            أضف ملاحظة
          </button>

          {/* Summary */}
          <div dir="rtl" className="flex flex-col gap-1.5 mt-1">
            <label className="text-[11px] font-bold text-text-muted">الملخص النهائي</label>
            <p className="text-[10px] text-text-muted/50 mb-1">
              ما رأيك العام في جودة هذا الكود؟ هل يمكن دمجه؟
            </p>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="اكتب ملخصك النهائي هنا..."
              rows={3}
              className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-3 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="px-5 py-3 border-t border-white/8 shrink-0">
          <button
            onClick={() => setStage("preview")}
            disabled={!canPreview}
            className="w-full flex items-center justify-center gap-2 bg-teal/15 hover:bg-teal/25 disabled:opacity-30 disabled:cursor-not-allowed text-teal text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"
          >
            <i className="fa-solid fa-clipboard-check text-[11px]" />
            مراجعة التقرير
          </button>
        </div>
      </div>
    </div>
  );
}