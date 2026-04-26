import { getScoreMeta } from "../../utils/reviewUtils";

function ScoreRing({ score }: { score: number }) {
  const { r, circ, dash, color, label, labelColor } = getScoreMeta(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#EFF6F8" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r}
            fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[22px] font-bold text-bg-dark">
          {score}
        </span>
      </div>
      <span className={`text-[12px] font-bold ${labelColor}`}>{label}</span>
    </div>
  );
}

export default ScoreRing;