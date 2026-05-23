import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReview } from "../hooks/useReviewApi";
import ScoreRing from "../components/review/ScoreRing";
import SectionCard from "../components/review/SectionCard";

const LABELS = {
  results: "نتائج",
  answersTitle: "مراجعة إجاباتك",
  fitLabel: "توافقك مع مهنة",
  fitBased: "بناءً على هذه المهمة:",
  fitTotal: "التوافق الكلي",
  back: "← رجوع",
  backTo: "العودة لصفحة",
  correct: "إجابة صحيحة",
  wrong: "إجابة خاطئة",
} as const;

function ReviewPage() {
  const navigate = useNavigate();
  const { jobId, taskId } = useParams<{ jobId: string; taskId: string }>();
  const [searchParams] = useSearchParams();
  const simId = searchParams.get("sim") ?? "";
  const taskDbId = searchParams.get("task") ?? "";

  const { data, loading, error } = useReview(jobId ?? "", taskDbId, simId);

  if (loading) return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <p className="text-text-muted text-sm">جارٍ التحميل...</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <p className="text-text-muted text-sm">فشل تحميل النتائج</p>
    </div>
  );

  const { review, jobTitleAr, taskTitle, taskDuration } = data;
  const correctCount = review.answerReview.filter((a) => a.is_correct).length;
  const total = review.answerReview.length;

  return (
    <div className="min-h-screen bg-bg-light" dir="rtl">

      {/* Top Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-bg-dark flex items-center justify-between px-10 shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-text-on-dark text-[14px] font-bold">{jobTitleAr}</span>
          <span className="text-text-muted text-[11px]">{taskTitle}</span>
        </div>
        <button
          onClick={() => navigate(`/jobs/${jobId}`)}
          className="text-[13px] font-bold text-text-on-dark/70 hover:text-text-on-dark border border-white/15 hover:border-white/30 px-4 py-1.5 rounded-sm transition-all cursor-pointer bg-transparent"
        >
          {LABELS.back}
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 flex flex-col gap-6">

        {/* Hero */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[32px] font-bold text-bg-dark-secondary leading-tight">
              {LABELS.results} {taskTitle}
            </h1>
            <p className="text-[14px] text-text-muted mt-1">
              {jobTitleAr} · {taskTitle} 
            </p>
          </div>
          <ScoreRing score={review.score} />
        </div>

        <SectionCard >
          <div className="flex flex-col gap-3">
            {review.detailedFeedback.map((para, i) => (
              <p key={i} className="text-[14px] text-text-muted leading-[1.8] bg-bg-light rounded-md px-5 py-4">
                {para}
              </p>
            ))}
          </div>
        </SectionCard>

        <SectionCard >
          <div className="flex flex-col gap-3">
            {review.answerReview.map((item) => (
              <div
                key={item.id}
                className={`px-4 py-3 rounded-xl border ${item.is_correct
                    ? "bg-teal/8 border-teal/20"
                    : "bg-red-500/5 border-red-400/20"
                  }`}
              >
                <p className="text-[13px] font-semibold text-bg-dark-secondary mb-2">
                  {item.question}
                </p>
                <div className="flex flex-col gap-1">
                  <span className={`text-[12px] ${item.is_correct ? "text-teal" : "text-red-400"}`}>
                    إجابتك: {item.user_answer}
                    {item.is_correct ? " ✓" : " ✗"}
                  </span>
                  {!item.is_correct && (
                    <span className="text-[12px] text-teal">
                      الإجابة الصحيحة: {item.correct_feedback ?? item.correct_answer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="bg-bg-dark rounded-[20px] px-8 py-7 flex flex-col gap-4">
          <div className="text-[11px] font-bold text-text-on-dark/50 tracking-widest uppercase">
            {LABELS.fitLabel} {jobTitleAr}
          </div>
          <p className="text-[13px] text-text-on-dark/60 leading-[1.8] max-w-2xl">
            {review.fitSummary}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-[14px] font-bold text-gold">{review.fitPercent}%</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-700"
                style={{ width: `${review.fitPercent}%` }}
              />
            </div>
            <span className="text-[13px] text-text-on-dark/50">{LABELS.fitTotal}</span>
          </div>
          <button
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="w-fit bg-white/10 hover:bg-white/15 border border-white/15 text-text-on-dark text-[13px] font-bold px-5 py-2.5 rounded-[10px] transition-all mt-2 cursor-pointer"
          >
            {LABELS.backTo} {jobTitleAr}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReviewPage;