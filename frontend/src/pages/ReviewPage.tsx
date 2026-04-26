import { useNavigate, useParams } from "react-router-dom";
import { useReview } from "../hooks/useReview";
import { getFitLabel } from "../utils/reviewUtils";
import ScoreRing from "../components/review/ScoreRing";
import SkillBar from "../components/review/SkillBar";
import SectionCard from "../components/review/SectionCard";

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
          <span className="text-white text-[14px] font-bold">{jobTitleAr}</span>
          <span className="text-text-muted text-[11px]">{taskTitle}</span>
        </div>
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="text-[13px] font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-4 py-1.5 rounded-[8px] transition-all"
        >
          ← رجوع
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-20 flex flex-col gap-6">

        {/* Hero */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-teal/10 text-teal border border-teal/20 rounded-full px-3 py-0.5 w-fit mb-1">
              ✓ تم التقييم
            </span>
            <h1 className="text-[32px] font-bold text-bg-dark leading-tight">
              نتائج {taskTitle}
            </h1>
            <p className="text-[14px] text-text-muted mt-1">
              {jobTitleAr} · {taskTitle} · {taskDuration}
            </p>
          </div>
          <ScoreRing score={review.score} />
        </div>

        {/* Skills + Strengths row */}
        <div className="grid grid-cols-2 gap-5">
          <SectionCard title="تقييم المهارات" icon="◎">
            <div className="flex flex-col gap-4">
              {review.skills.map((s, i) => (
                <SkillBar key={i} {...s} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="نقاط القوة والتطوير" icon="⚙">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[12px] font-bold text-teal mb-3">✓ نقاط القوة</div>
                <ul className="flex flex-col gap-2">
                  {review.strengths.map((s, i) => (
                    <li key={i} className="text-[13px] text-text-muted flex items-start gap-1.5">
                      <span className="text-teal mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[12px] font-bold text-accent mb-3">↑ للتطوير</div>
                <ul className="flex flex-col gap-2">
                  {review.improvements.map((s, i) => (
                    <li key={i} className="text-[13px] text-text-muted flex items-start gap-1.5">
                      <span className="text-accent mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Detailed feedback */}
        <SectionCard title="تغذية راجعة تفصيلية" icon="💬">
          <div className="flex flex-col gap-3">
            {review.detailedFeedback.map((para, i) => (
              <p key={i} className="text-[14px] text-text-muted leading-[1.8] bg-bg-light rounded-[12px] px-5 py-4">
                {para}
              </p>
            ))}
          </div>
        </SectionCard>

        {/* Answer review */}
        <SectionCard title="مراجعة إجاباتك" icon="🔍">
          <div className="flex flex-col gap-5">
            {review.answerReview.map((block, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-[13px] font-bold text-bg-dark">{block.title}</div>
                {block.items.map((item, j) => (
                  <div
                    key={j}
                    className={`text-[13px] px-4 py-2.5 rounded-[10px] leading-[1.7] ${
                      item.correct ? "bg-teal/8 text-teal" : "text-text-muted"
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
          <div className="text-[11px] font-bold text-white/50 tracking-widest uppercase">
            توافقك مع مهنة {jobTitleAr}
          </div>
          <div className="text-[22px] font-bold text-white">
            بناءً على هذه المهمة: {getFitLabel(review.fitPercent)}
          </div>
          <p className="text-[13px] text-white/60 leading-[1.8] max-w-2xl">
            {review.fitSummary}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-[14px] font-bold text-accent">{review.fitPercent}%</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${review.fitPercent}%` }}
              />
            </div>
            <span className="text-[13px] text-white/50">التوافق الكلي</span>
          </div>
          <button
            onClick={() => navigate(`/jobs/${id}`)}
            className="w-fit bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[13px] font-bold px-5 py-2.5 rounded-[10px] transition-all mt-2"
          >
            العودة لصفحة {jobTitleAr}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReviewPage;