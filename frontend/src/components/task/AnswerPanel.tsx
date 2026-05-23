import { useState } from "react";

interface Question {
  id: number;
  question: string;
}

interface Props {
  questions: Question[];
  onSubmit: (answers: Record<number, string>) => void;
  submitting?: boolean;
}

type Stage = "answering" | "review";

export default function AnswerPanel({ questions, onSubmit, submitting }: Props) {
  const [answers, setAnswers]     = useState<Record<number, string>>({});
  const [current, setCurrent]     = useState(0);
  const [stage, setStage]         = useState<Stage>("answering");

  const total      = questions.length;
  const q          = questions[current];
  const answered   = Object.values(answers).filter((a) => a.trim()).length;
  const progress   = Math.round((answered / total) * 100);
  const canNext    = !!answers[q?.id]?.trim();
  const isLast     = current === total - 1;

  const handleChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleNext = () => {
    if (isLast) setStage("review");
    else setCurrent((c) => c + 1);
  };

  const handleBack = () => {
    if (stage === "review") setStage("answering");
    else if (current > 0) setCurrent((c) => c - 1);
  };

  // ── Review stage ──────────────────────────────────────────────────────────
  if (stage === "review") {
    return (
      <div dir="rtl" className="flex flex-col h-full bg-bg-dark">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 shrink-0">
          <button
            onClick={handleBack}
            className="text-text-muted hover:text-text-on-dark transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right text-[12px]" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            مراجعة إجاباتك
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5 min-h-0">
          {questions.map((q, idx) => (
            <div key={q.id} className="px-5 py-3 flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] text-text-muted leading-relaxed">
                  <span className="text-teal font-bold ml-1">{idx + 1}.</span>
                  {q.question}
                </p>
                <button
                  onClick={() => { setCurrent(idx); setStage("answering"); }}
                  className="text-[11px] text-teal/70 hover:text-teal shrink-0 border-0 bg-transparent cursor-pointer transition-colors"
                >
                  تعديل
                </button>
              </div>
              <p className="text-[12px] text-text-on-dark bg-white/5 rounded-lg px-3 py-2 leading-relaxed">
                {answers[q.id] || <span className="text-text-muted/40">لم تجب</span>}
              </p>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-white/8 shrink-0">
          <button
            onClick={() => onSubmit(answers)}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-bg-dark text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"
          >
            {submitting ? (
              <><i className="fa-solid fa-spinner fa-spin text-[11px]" /> جارٍ الإرسال...</>
            ) : (
              <><i className="fa-solid fa-paper-plane text-[11px]" /> تأكيد الإرسال</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── Answering stage ───────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="flex flex-col h-full bg-bg-dark">

      {/* Header + progress */}
      <div className="flex flex-col gap-2 px-5 pt-4 pb-3 border-b border-white/8 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            الأسئلة
          </span>
          <span className="text-[11px] text-text-muted">
            {current + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 justify-center pt-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full border-0 cursor-pointer transition-all duration-200 ${
                i === current
                  ? "w-4 h-2 bg-teal"
                  : answers[questions[i].id]?.trim()
                  ? "w-2 h-2 bg-teal/40"
                  : "w-2 h-2 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-between px-5 py-5 min-h-0">
        <div className="flex flex-col gap-4">
          <p className="text-[13px] text-text-on-dark leading-relaxed">
            <span className="text-teal font-bold ml-1">{current + 1}.</span>
            {q.question}
          </p>
          <textarea
            key={q.id}
            value={answers[q.id] ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
            rows={5}
            className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-3 py-2.5 text-[13px] leading-relaxed text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
          />
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-on-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right text-[11px]" />
            السابق
          </button>

          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center gap-1.5 bg-teal/15 hover:bg-teal/25 disabled:opacity-30 disabled:cursor-not-allowed text-teal text-[12px] font-bold px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer"
          >
            {isLast ? "مراجعة الإجابات" : "التالي"}
            {!isLast && <i className="fa-solid fa-arrow-left text-[11px]" />}
          </button>
        </div>
      </div>

    </div>
  );
}