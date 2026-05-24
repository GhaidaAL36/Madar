// CodeTask.tsx
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { CodeTaskType } from "@/types/CodeTask";
import { useCodeTask } from "@/hooks/useCodeTaskApi";
import HintsPanel from "../HintsPanel";
import OutputPanel from "./OutputPanel";
import { executeCode, LANGUAGE_CONFIG, type SupportedLanguage } from "@/services/codeExecutorService";

const LABELS = {
  run: "تشغيل",
  running: "جارٍ التشغيل...",
  submit: "إرسال",
  typeBadge: {
    "write-code": "كتابة كود",
    "debug-code": "تصحيح كود",
    "code-review": "تنظيف كود",
  } as Record<CodeTaskType, string>,
} as const;

interface Props {
  taskType: CodeTaskType;
  taskDbId: number;
  jobId: string;
  onSubmit: (code: string) => void;
}

export default function CodeTask({ taskType, taskDbId, jobId, onSubmit }: Props) {
  const { codeTask, loading, error } = useCodeTask(jobId, String(taskDbId), taskType);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  // Initialize editor with starter code once task loads
  useEffect(() => {
    if (!codeTask) return;
    const initialCode =
      codeTask.buggyCode ??
      codeTask.starterCode ??
      LANGUAGE_CONFIG[codeTask.language as SupportedLanguage]?.starterCode ??
      "";
    setCode(initialCode);
  }, [codeTask]);

  const handleRun = async () => {
    if (!codeTask) return;
    setRunning(true);
    setOutput(null);
    try {
      const result = await executeCode(codeTask.language as SupportedLanguage, code);
      const out = result.stdout || result.stderr || result.exception;
      setOutput(out || "لا يوجد مخرجات");
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-text-muted text-sm">
      جارٍ التحميل...
    </div>
  );

  if (error || !codeTask) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-red-400 text-sm">
      {error ?? "فشل تحميل بيانات المهمة"}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 h-full bg-bg-dark overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {/* Left: editor */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-bg-dark border-b border-white/8 shrink-0">
            <span className="text-[11px] text-text-muted font-mono">
              {codeTask.language === "python" ? "solution.py" : "solution.js"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 bg-gold-dark hover:bg-gold/80 disabled:opacity-50 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-0 disabled:cursor-not-allowed"
              >
                {running ? LABELS.running : LABELS.run}
              </button>
              <button
                onClick={() => onSubmit(code)}
                className="flex items-center gap-1.5 bg-teal hover:bg-teal-light text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-0"
              >
                إرسال
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden" dir="ltr">
            <Editor
              height="100%"
              language={codeTask.language}
              value={code}
              onChange={(val) => setCode(val ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 16, bottom: 16 },
                wordWrap: "on",
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col w-80 shrink-0 border-l border-white/8 overflow-hidden">


          {/* For write_function: show expected output */}
          {codeTask.taskType === "write_function" && codeTask.expectedOutput && (
            <div dir="ltr" className="px-4 py-3 border-b border-white/8 shrink-0">
              <p className="text-[11px] font-bold text-text-muted mb-2" dir="rtl">
                المخرجات المتوقعة
              </p>
              <pre className="text-[11px] text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
                {codeTask.expectedOutput}
              </pre>
            </div>
          )}

          <OutputPanel output={output} running={running} />
        </div>
      </div>

      <HintsPanel hints={codeTask.hints} />
    </div>
  );
}