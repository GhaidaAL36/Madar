import "@/style/scrollbar.css";

interface Props {
  description: string;
  userJourney: string[];
}

const LABELS = {
  problem: "وصف المشكلة",
  journey: "رحلة المستخدم",
} as const;

export default function UXProblemView({ description, userJourney }: Props) {
  return (
    <div className="custom-scrollbar h-full overflow-auto px-5 py-5 flex flex-col gap-5" dir="rtl">

      {/* Description */}
      {description && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-4 rounded-full bg-purple-400 shrink-0" />
            <h3 className="text-[13px] font-bold text-text-on-dark">{LABELS.problem}</h3>
          </div>
          <p className="text-[13px] text-text-muted leading-relaxed bg-white/4 rounded-lg px-3 py-2.5">
            {description}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {userJourney.map((step, i) => {
          const isProblematic = i === 2;
          return (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${isProblematic
                    ? "bg-red-500/20 text-red-400 border border-red-400/30"
                    : "bg-white/8 text-text-muted border border-white/10"
                  }`}
              >
                {i + 1}
              </div>
              <div
                className={`flex-1 rounded-lg px-3 py-2.5 ${isProblematic
                    ? "bg-red-500/8 border border-red-400/20"
                    : "bg-white/4"
                  }`}
              >
                <p
                  className={`text-[13px] leading-relaxed ${isProblematic ? "text-red-300" : "text-text-muted"
                    }`}
                >
                  {step}
                </p>
                {isProblematic && (
                  <span className="text-[11px] text-red-400 font-bold mt-1 block">
                    ← أعلى نسبة إلغاء هنا
                  </span>
                )}
              </div>
              {i < userJourney.length - 1 && <div className="absolute" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
