import type { StatItem } from "@/types/DataTask";
import "@/style/scrollbar.css"

interface Props {
  stats: StatItem[];
}

export default function StatsTab({ stats }: Props) {
  return (
    <div className="custom-scrollbar h-full overflow-auto p-5">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 rounded-xl px-4 py-4 flex flex-col gap-1 border border-white/8"
          >
            <span className="text-[11px] text-text-muted leading-relaxed">
              {stat.label}
            </span>
            <span className="text-[18px] font-bold text-text-on-dark">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
