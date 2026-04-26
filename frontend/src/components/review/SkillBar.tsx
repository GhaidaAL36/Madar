import type { SkillRating } from "../../types/Review";

function SkillBar({ label, value, color }: SkillRating) {
  const barColor =
    color === "teal"
      ? "bg-[var(--color-teal-light)]"
      : "bg-[var(--color-gold)]";

  const textColor =
    color === "teal"
      ? "text-[var(--color-teal-light)]"
      : "text-[var(--color-gold)]";

  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-text-muted w-36 text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className={`text-[13px] font-bold ${textColor} w-8 text-left shrink-0`}
      >
        {value}%
      </span>
    </div>
  );
}

export default SkillBar;
