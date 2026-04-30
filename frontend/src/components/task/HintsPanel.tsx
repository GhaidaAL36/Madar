import { useState } from "react";

const LABELS = {
  hints:     "💡 تلميحات",
  showHint:  "إظهار تلميح",
  hintOf:    "من",
  noMore:    "لا توجد تلميحات إضافية",
} as const;

interface Props {
  hints: string[];
}

export default function HintsPanel({ hints }: Props) {
  const [open, setOpen]         = useState(false);
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="border-t border-white/8 shrink-0" dir="rtl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-text-muted hover:text-text-on-dark transition-colors cursor-pointer border-0 bg-transparent"
      >
        <span className="text-[13px] font-semibold">{LABELS.hints}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-4 flex flex-col gap-2">
          {hints.slice(0, revealed).map((hint, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-white/5 rounded-lg px-3 py-2.5">
              <span className="text-accent text-[12px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-[13px] text-text-muted leading-relaxed">{hint}</p>
            </div>
          ))}

          {revealed < hints.length && (
            <button
              onClick={() => setRevealed((r) => r + 1)}
              className="text-[12px] font-bold text-teal hover:text-teal/80 text-right transition-colors cursor-pointer bg-transparent border-0 mt-1"
            >
              {LABELS.showHint} ({revealed + 1} {LABELS.hintOf} {hints.length})
            </button>
          )}

          {revealed === hints.length && revealed > 0 && (
            <p className="text-[11px] text-text-muted/50 text-center mt-1">
              {LABELS.noMore}
            </p>
          )}
        </div>
      )}
    </div>
  );
}