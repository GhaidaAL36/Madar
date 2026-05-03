const LABELS = {
  output: "المخرجات",
  outputEmpty: "اضغط تشغيل لرؤية النتيجة",
  running: "جارٍ التشغيل...",
} as const;

interface Props {
  output: string | null;
  running: boolean;
}

export default function OutputPanel({ output, running }: Props) {
  const isError = output?.toLowerCase().includes("error");

  return (
    <div className="flex w-64 shrink-0 flex-col bg-[#0d1f28]">
      <div className="shrink-0 border-b border-white/[0.08] px-4 py-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          {LABELS.output}
        </span>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4">
        {running && (
          <div className="flex items-center gap-2 text-[13px] text-text-muted">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal"
            />
            {LABELS.running}
          </div>
        )}

        {!running && output === null && (
          <p className="text-[12px] leading-relaxed text-text-muted/50">
            {LABELS.outputEmpty}
          </p>
        )}

        {!running && output !== null && (
          <pre
            className={`whitespace-pre-wrap text-[13px] font-mono leading-relaxed ${
              isError ? "text-red-400" : "text-green-400"
            }`}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
