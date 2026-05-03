import type { DocumentSection } from "@/types/PMTask";
import "@/style/scrollbar.css"

interface Props {
  title: string;
  sections: DocumentSection[];
}

const STAKEHOLDER_COLORS = [
  "bg-teal/10 border-teal/20",
  "bg-red-500/8 border-red-400/20",
  "bg-amber-500/8 border-amber-400/20",
  "bg-purple-500/8 border-purple-400/20",
  "bg-white/5 border-white/10",
  "bg-white/5 border-white/10",
];

const ACCENT_COLORS = [
  "bg-teal",
  "bg-red-400",
  "bg-amber-400",
  "bg-purple-400",
  "bg-white/30",
  "bg-white/30",
];

export default function StakeholderView({ title, sections }: Props) {
  return (
    <div className="custom-scrollbar h-full overflow-auto px-6 py-5" dir="rtl">
      <h2 className="text-[18px] font-bold text-text-on-dark mb-5 pb-3 border-b border-white/10">
        {title}
      </h2>

      <div className="flex flex-col gap-4">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-4 border flex flex-col gap-2 ${
              STAKEHOLDER_COLORS[i] ?? "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1 h-4 rounded-full shrink-0 ${
                ACCENT_COLORS[i] ?? "bg-white/30"
              }`} />
              <h3 className="text-[13px] font-bold text-text-on-dark">
                {section.heading}
              </h3>
            </div>
            <div className="pr-3 flex flex-col gap-1">
              {section.body.split("\n").map((line, j) => (
                <p key={j} className="text-[13px] text-text-muted leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
