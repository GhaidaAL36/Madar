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

export default function AnswerPanel({ questions, onSubmit, submitting }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]?.trim());

  return (
    <div dir="rtl" className="flex flex-col h-full bg-bg-dark">

      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          الأسئلة
        </span>
        <span className="text-[11px] text-text-muted">
          {Object.values(answers).filter((a) => a.trim()).length} / {questions.length} أجبت
        </span>
      </div>

      {/* questions — takes remaining space, scrolls */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 min-h-0">
        {questions.map((q, idx) => (
          <div key={q.id} className="px-5 py-3 flex flex-col gap-2">
            <p className="text-[12px] text-text-on-dark leading-relaxed">
              <span className="text-teal font-bold ml-1">{idx + 1}.</span>
              {q.question}
            </p>
            <textarea
              value={answers[q.id] ?? ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              rows={2}
              className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-3 py-2 text-[12px] leading-relaxed text-text-muted outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* submit — always pinned to bottom */}
      <div className="px-5 py-3 border-t border-white/8 shrink-0 bg-bg-dark">
        <button
          onClick={() => onSubmit(answers)}
          disabled={!allAnswered || submitting}
          className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-bg-dark text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"        >
          {submitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-[11px]" />
              جارٍ الإرسال...
            </>
          ) : (
            <>
              <i className="fa-solid text-[11px]" />
              إرسال الإجابات
            </>
          )}
        </button>
      </div>

    </div>
  );
}