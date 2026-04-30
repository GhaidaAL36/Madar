const LABELS = {
  output:      "المخرجات",
  outputEmpty: "اضغط تشغيل لرؤية النتيجة",
  running:     "جارٍ التشغيل...",
} as const;

interface Props {
  output:  string | null;
  running: boolean;
}

export default function OutputPanel({ output, running }: Props) {
  const isError = output?.toLowerCase().includes("error");

  return (
    <div className="w-64 shrink-0 flex flex-col bg-[#0d1f28]">
      <div className="px-4 py-2.5 border-b border-white/8 shrink-0">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
          {LABELS.output}
        </span>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4">
        {running && (
          <div className="flex items-center gap-2 text-text-muted text-[13px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            {LABELS.running}
          </div>
        )}

        {!running && output === null && (
          <p className="text-[12px] text-text-muted/50 leading-relaxed">
            {LABELS.outputEmpty}
          </p>
        )}

        {!running && output !== null && (
          <pre className={`text-[13px] font-mono leading-relaxed whitespace-pre-wrap ${
            isError ? "text-red-400" : "text-green-400"
          }`}>
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}