import type { DocumentSection } from "@/types/PMTask";
import "@/style/scrollbar.css"

interface Props {
  title: string;
  sections: DocumentSection[];
}

export default function DocumentView({ title, sections }: Props) {
  return (
    <div className="custom-scrollbar h-full overflow-auto px-6 py-5" dir="rtl">
      <h2 className="text-[18px] font-bold text-text-on-dark mb-5 pb-3 border-b border-white/10">
        {title}
      </h2>

      <div className="flex flex-col gap-5">
        {sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-teal shrink-0" />
              <h3 className="text-[14px] font-bold text-text-on-dark">
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
