import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { CodeTaskType } from "@/types/CodeTask";
import { useCodeTask } from "@/hooks/useCodeTask"; // remove when api
// import { useCodeTask } from "../hooks/useCodeTaskApi"; - when api
import { simulateRun } from "@/utils/codeRunner";
import HintsPanel from "../HintsPanel";
import OutputPanel from "./OutputPanel";

const LABELS = {
  run: "تشغيل",
  running: "جارٍ التشغيل...",
  submit: "إرسال",
  filename: "solution.py",
  typeBadge: {
    "write-code": "كتابة كود",
    "fix-code": "تصحيح كود",
    "clean-code": "تنظيف كود",
  } as Record<CodeTaskType, string>,
  typeBadgeColor: {
    "write-code": "bg-teal/15 text-teal border-teal/25",
    "fix-code": "bg-red-500/10 text-red-400 border-red-400/25",
    "clean-code": "bg-accent/15 text-accent border-accent/25",
  },
} as const;

interface Props {
  taskType: CodeTaskType;
  onSubmit: () => void;
}

export default function CodeTask({ taskType, onSubmit }: Props) {
  const codeTaskData = useCodeTask(taskType);
  const [code, setCode] = useState(codeTaskData.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setCode(codeTaskData.starterCode);
    setOutput(null);
  }, [taskType, codeTaskData.starterCode]);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    const result = await simulateRun(code, codeTaskData.expectedOutput);
    setOutput(result);
    setRunning(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-bg-dark overflow-hidden">
      <div className="flex items-start gap-4 px-5 py-4 border-b border-white/8 shrink-0">
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 mt-0.5 ${LABELS.typeBadgeColor[taskType]}`}
        >
          {LABELS.typeBadge[taskType]}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-bg-dark border-b border-white/8 shrink-0">
            <span className="text-[11px] text-text-muted font-mono">
              {LABELS.filename}
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
                onClick={onSubmit}
                className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-bg-dark text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-0"
              >
                {LABELS.submit}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden" dir="ltr">
            <Editor
              height="100%"
              language="python"
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

        <OutputPanel output={output} running={running} />
      </div>

      <HintsPanel hints={codeTaskData.hints} />
    </div>
  );
}
