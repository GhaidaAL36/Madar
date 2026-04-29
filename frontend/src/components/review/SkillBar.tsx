import type { SkillRating } from "../../types/Review";

const COLOR_MAP: Record<SkillRating["color"], { bar: string; text: string }> = {
  teal: { bar: "bg-teal-light", text: "text-teal-light" },
  gold: { bar: "bg-gold",       text: "text-gold"       },
};

function SkillBar({ label, value, color }: SkillRating) {
  const { bar, text } = COLOR_MAP[color];

  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-text-muted w-36 text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-bg-card-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${bar} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-[13px] font-bold ${text} w-8 text-left shrink-0`}>
        {value}%
      </span>
    </div>
  );
}

export default SkillBar;