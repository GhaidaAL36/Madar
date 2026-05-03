import { useState } from "react";

const LABELS = {
  textLabel: "تحليلك",
  textPlaceholder: "اكتب ملاحظاتك وتحليلك للبيانات هنا...",
} as const;

export default function AnswerPanel() {
  const [analysis, setAnalysis] = useState("");

  return (
    <div
      dir="rtl"
      className="max-h-65 shrink-0 border-t border-white/8 bg-bg-dark"
    >
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-white/8 px-4 py-2.5">
            <label
              htmlFor="analysis"
              className="text-[11px] font-bold uppercase tracking-wider text-text-muted"
            >
              {LABELS.textLabel}
            </label>
          </div>

          <textarea
            id="analysis"
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            placeholder={LABELS.textPlaceholder}
            className="flex-1 resize-none bg-transparent px-4 py-3 text-[13px] leading-relaxed text-text-muted outline-none placeholder:text-text-muted/30"
          />
        </div>
      </div>
    </div>
  );
}
