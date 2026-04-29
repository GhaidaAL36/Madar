import { useNavigate, useParams } from "react-router-dom";
import { useReview } from "../hooks/useReview"; // delete when api
// import { useReview } from "../hooks/useReviewApi"; - when api
import { getFitLabel } from "../utils/reviewUtils";
import ScoreRing from "../components/review/ScoreRing";
import SkillBar from "../components/review/SkillBar";
import SectionCard from "../components/review/SectionCard";

const LABELS = {
  evaluated:       "✓ تم التقييم",
  results:         "نتائج",
  skillsTitle:     "تقييم المهارات",
  strengthsTitle:  "نقاط القوة والتطوير",
  strengthsLabel:  "✓ نقاط القوة",
  improvLabel:     "↑ للتطوير",
  feedbackTitle:   "تغذية راجعة تفصيلية",
  answersTitle:    "مراجعة إجاباتك",
  fitLabel:        "توافقك مع مهنة",
  fitBased:        "بناءً على هذه المهمة:",
  fitTotal:        "التوافق الكلي",
  back:            "← رجوع",
  backTo:          "العودة لصفحة",
} as const;

function ReviewPage() {
  const navigate = useNavigate();
  const { id, taskId } = useParams<{ id: string; taskId: string }>();

  const { review, jobTitleAr, taskTitle, taskDuration } = useReview(
    id ?? "",
    Number(taskId ?? 1)
  );

  return (
    <div className="min-h-screen bg-bg-light" dir="rtl">

      {/* Top Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-bg-dark flex items-center justify-between px-10 shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-text-on-dark text-[14px] font-bold">{jobTitleAr}</span>
          <span className="text-text-muted text-[11px]">{taskTitle}</span>
        </div>
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="text-[13px] font-bold text-text-on-dark/70 hover:text-text-on-dark border border-white/15 hover:border-white/30 px-4 py-1.5 rounded-sm transition-all cursor-pointer bg-transparent"
        >
          {LABELS.back}
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-275 mx-auto px-6 pt-24 pb-20 flex flex-col gap-6">

        {/* Hero */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-teal/10 text-teal border border-teal/20 rounded-full px-3 py-0.5 w-fit mb-1">
              {LABELS.evaluated}
            </span>
            <h1 className="text-[32px] font-bold text-bg-dark-secondary leading-tight">
              {LABELS.results} {taskTitle}
            </h1>
            <p className="text-[14px] text-text-muted mt-1">
              {jobTitleAr} · {taskTitle} · {taskDuration}
            </p>
          </div>
          <ScoreRing score={review.score} />
        </div>

        {/* Skills + Strengths */}
        <div className="grid grid-cols-2 gap-5">
          <SectionCard title={LABELS.skillsTitle} icon="◎">
            <div className="flex flex-col gap-4">
              {review.skills.map((s) => (
                <SkillBar key={s.label} {...s} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title={LABELS.strengthsTitle} icon="⚙">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[12px] font-bold text-teal mb-3">
                  {LABELS.strengthsLabel}
                </div>
                <ul className="flex flex-col gap-2">
                  {review.strengths.map((s) => (
                    <li key={s} className="text-[13px] text-text-muted flex items-start gap-1.5">
                      <span className="text-teal mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[12px] font-bold text-gold mb-3">
                  {LABELS.improvLabel}
                </div>
                <ul className="flex flex-col gap-2">
                  {review.improvements.map((s) => (
                    <li key={s} className="text-[13px] text-text-muted flex items-start gap-1.5">
                      <span className="text-gold mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Detailed feedback */}
        <SectionCard title={LABELS.feedbackTitle} icon="💬">
          <div className="flex flex-col gap-3">
            {review.detailedFeedback.map((para, i) => (
              <p key={i} className="text-[14px] text-text-muted leading-[1.8] bg-bg-light rounded-md px-5 py-4">
                {para}
              </p>
            ))}
          </div>
        </SectionCard>

        {/* Answer review */}
        <SectionCard title={LABELS.answersTitle} icon="🔍">
          <div className="flex flex-col gap-5">
            {review.answerReview.map((block, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-[13px] font-bold text-bg-dark-secondary">{block.title}</div>
                {block.items.map((item, j) => (
                  <div
                    key={j}
                    className={`text-[13px] px-4 py-2.5 rounded-[10px] leading-[1.7] ${
                      item.correct
                        ? "bg-teal/8 text-teal"
                        : "bg-bg-light-secondary text-text-muted"
                    }`}
                  >
                    {item.correct ? "✓ " : ""}{item.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Fit footer */}
        <div className="bg-bg-dark rounded-[20px] px-8 py-7 flex flex-col gap-4">
          <div className="text-[11px] font-bold text-text-on-dark/50 tracking-widest uppercase">
            {LABELS.fitLabel} {jobTitleAr}
          </div>
          <div className="text-[22px] font-bold text-text-on-dark">
            {LABELS.fitBased} {getFitLabel(review.fitPercent)}
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
            onClick={() => navigate(`/jobs/${id}`)}
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