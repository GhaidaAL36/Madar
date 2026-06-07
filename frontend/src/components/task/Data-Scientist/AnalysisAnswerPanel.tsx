import { useState } from "react";

export interface DataInsight {
  id: string;
  observation: string;
}

export interface AnalysisReport {
  insights: DataInsight[];
  conclusion: string;
}

interface Props {
  onSubmit: (report: AnalysisReport) => void;
  submitting?: boolean;
}

type Stage = "report" | "review";

let idCounter = 0;
const uid = () => String(++idCounter);

export default function AnalysisAnswerPanel({ onSubmit, submitting }: Props) {
  const [insights, setInsights] = useState<DataInsight[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [stage, setStage] = useState<Stage>("report");

  const addInsight = () => {
    setInsights((prev) => [...prev, { id: uid(), observation: "" }]);
  };

  const updateInsight = (id: string, value: string) => {
    setInsights((prev) => prev.map((ins) => (ins.id === id ? { ...ins, observation: value } : ins)));
  };

  const removeInsight = (id: string) => {
    setInsights((prev) => prev.filter((ins) => ins.id !== id));
  };

  const canReview = insights.length > 0 && insights.every((ins) => ins.observation.trim()) && conclusion.trim();

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
          <span className="text-[11px] font-bold text-text-muted">مراجعة التقرير</span>
          <span className="mr-auto text-[11px] text-text-muted">{insights.length} ملاحظة</span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3">
          {insights.map((ins, i) => (
            <div key={ins.id} className="flex flex-col gap-1 bg-bg-dark-secondary rounded-lg px-3 py-2.5">
              <span className="text-[11px] text-text-muted">ملاحظة #{i + 1}</span>
              <p className="text-[12px] text-text-on-dark leading-relaxed">{ins.observation}</p>
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
            onClick={() => onSubmit({ insights, conclusion })}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-bg-dark text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border-0"
          >
            {submitting
              ? <><i className="fa-solid fa-spinner fa-spin text-[11px]" /> جارٍ الإرسال...</>
              : <> إرسال التقرير</>
            }
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col h-full bg-bg-dark">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 shrink-0">
        <span className="text-[11px] font-bold text-text-muted">تقرير التحليل</span>
        {insights.length > 0 && (
          <span className="text-[11px] text-teal">{insights.length} ملاحظة مسجّلة</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3">

        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-[12px] text-text-muted/50 leading-relaxed">
              افحص البيانات وسجّل كل استنتاج تجده
            </p>
          </div>
        )}

        {insights.map((ins, i) => (
          <div key={ins.id} className="flex flex-col gap-2 bg-bg-dark-secondary rounded-lg px-3 py-3 border border-white/6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted">ملاحظة #{i + 1}</span>
              <button
                onClick={() => removeInsight(ins.id)}
                className="text-text-muted/40 hover:text-red-400 transition-colors border-0 bg-transparent cursor-pointer text-[11px]"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <textarea
              value={ins.observation}
              onChange={(e) => updateInsight(ins.id, e.target.value)}
              placeholder="ما الذي لاحظته في البيانات؟"
              rows={3}
              className="w-full resize-none rounded-lg bg-white/5 border border-white/8 px-2.5 py-2 text-[12px] text-text-on-dark outline-none placeholder:text-text-muted/30 focus:border-teal/40 transition-colors"
            />
          </div>
        ))}

        <button
          onClick={addInsight}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-white/15 hover:border-teal/40 text-[12px] text-text-muted hover:text-teal transition-all cursor-pointer bg-transparent"
        >
          <i className="fa-solid fa-plus text-[11px]" />
          أضف ملاحظة
        </button>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[11px] font-bold text-text-muted">الاستنتاج النهائي</label>
          <p className="text-[10px] text-text-muted/50 mb-1">
            ما أبرز ما اكتشفته من البيانات؟ ما توصيتك للإدارة؟
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
          مراجعة التقرير
        </button>
      </div>
    </div>
  );
}