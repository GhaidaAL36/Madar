interface Section {
  number: number;
  titleAr: string;
  titleEn?: string;
  lines: string[];
}

const toArabicNumeral = (n: number) =>
  n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const parseStructuredText = (text: string): Section[] => {
  const sections: Section[] = [];
  const chunks = text.split(/(?=^\d+\.\s)/m).filter(Boolean);

  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    const headerMatch = lines[0]?.match(/^(\d+)\.\s+(.+)$/);
    if (!headerMatch) continue;

    const number = parseInt(headerMatch[1], 10);
    const rawTitle = headerMatch[2];

    const enMatch = rawTitle.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    const titleAr = enMatch ? enMatch[1].trim() : rawTitle;
    const titleEn = enMatch ? enMatch[2].trim() : undefined;

    sections.push({ number, titleAr, titleEn, lines: lines.slice(1) });
  }
  return sections;
};

const StructuredDescription = ({ text }: { text: string }) => {
  const sections = parseStructuredText(text);
  if (!sections.length) {
    return (
      <p className="text-text-on-dark text-sm leading-relaxed text-right max-w-140">
        {text}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-140">
      {sections.map((section, idx) => (
        <div key={section.number}>
          {idx > 0 && <div className="h-px bg-teal/10 mb-5" />}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 flex-row-reverse">
              <div className="w-7 h-7 rounded-md bg-teal/10 border border-teal/40 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-teal leading-none">
                  {toArabicNumeral(section.number)}
                </span>
              </div>
              <p className="text-sm font-semibold text-text-on-dark text-right">
                {section.titleAr}
                {section.titleEn && (
                  <span className="text-teal font-normal text-xs mr-1.5">
                    ({section.titleEn})
                  </span>
                )}
              </p>
            </div>

            <div className="pr-9 flex flex-col gap-1.5">
              {section.lines.map((line, i) => {
                if (line.startsWith("- ")) {
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2 flex-row-reverse"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-1.5" />
                      <p className="text-xs text-text-muted leading-relaxed text-right">
                        {line.slice(2)}
                      </p>
                    </div>
                  );
                }
                if (line.startsWith("مثال:")) {
                  return (
                    <div
                      key={i}
                      className="bg-teal/5 border-r-2 border-teal pr-2.5 pl-2 py-2 rounded-r-none rounded-l-md"
                    >
                      <p
                        dir="rtl"
                        className="text-xs text-teal/80 leading-relaxed text-right"
                        dangerouslySetInnerHTML={{
                          __html: line.replace(
                            /`([^`]+)`/g,
                            '<code class="bg-teal/20 px-1 py-0.5 rounded text-[11px] font-mono text-teal">$1</code>'
                          ),
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <p
                    key={i}
                    className="text-xs text-text-on-dark/70 leading-relaxed text-right"
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StructuredDescription;