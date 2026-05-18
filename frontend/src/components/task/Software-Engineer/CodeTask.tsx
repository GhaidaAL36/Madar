import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import type { CodeTaskQuestion } from "@/types/CodeTask";
import { taskService } from "@/services/taskService";

interface Props {
  jobId: string;
  taskDbId: number;
  simulationId: string;
  starterCode: string;
  instructions: string;
  questions: CodeTaskQuestion[];
  onSubmit: (answer: string) => void;
}

export default function CodeTask({
  jobId,
  taskDbId,
  simulationId,
  starterCode,
  instructions,
  questions,
  onSubmit,
}: Props) {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const [code, setCode]               = useState(starterCode);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => { setCode(starterCode); }, [starterCode]);

  const handleAnswerSelect = (questionId: number, choice: string) => {
    setUserAnswers((prev) => ({ ...prev, [String(questionId)]: choice }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const allAnswered   = answeredCount === questions.length;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await taskService.submitSimulation(jobId, taskDbId, simulationId, questions, userAnswers);
      navigate(`/jobs/${jobId}/tasks/${taskId}/review?sim=${simulationId}&task=${taskDbId}`);
    } catch {
      console.error("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-bg-dark" dir="ltr">

      <div className="flex flex-col flex-1 overflow-hidden border-l border-white/8">

        <div className="px-5 py-3 bg-bg-dark-secondary/40 border-b border-white/8 shrink-0" dir="rtl">
          <p className="text-xs text-text-muted leading-relaxed">{instructions}</p>
        </div>

        <div className="flex items-center gap-0 px-4 pt-3 bg-bg-dark shrink-0 border-b border-white/8">
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-dark-secondary/60 rounded-t-lg border border-b-0 border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-teal/60" />
            <span className="text-[11px] text-text-muted font-mono">solution.py</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language="python"
            value={code}
            onChange={(val) => setCode(val ?? "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
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

      <div className="w-80 shrink-0 flex flex-col bg-[#0a1a22] border-l border-white/8 overflow-hidden" dir="rtl">

        <div className="px-5 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">الأسئلة</span>
            <span className="text-[11px] text-text-muted">
              {answeredCount} / {questions.length}
            </span>
          </div>
          <div className="mt-2.5 w-full h-0.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal transition-all duration-300"
              style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="flex flex-col gap-3">
              {/* Question */}
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-[10px] font-bold text-teal mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-text-on-dark leading-relaxed">{q.question}</p>
              </div>

              {/* Choices */}
              <div className="flex flex-col gap-1.5 pr-7">
                {q.choices.map((choice) => {
                  const letter = choice.charAt(0);
                  const selected = userAnswers[String(q.id)] === letter;
                  return (
                    <button
                      key={choice}
                      onClick={() => handleAnswerSelect(q.id, letter)}
                      className={`text-right text-xs px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
                        selected
                          ? "bg-teal/20 border-teal text-teal font-semibold"
                          : "bg-white/4 border-white/8 text-text-muted hover:bg-white/8 hover:border-white/15"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-white/8 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed bg-gold-dark hover:bg-gold text-white"
          >
            {submitting ? "جارٍ الإرسال..." : "إرسال الإجابات"}
          </button>
          {!allAnswered && (
            <p className="text-center text-[10px] text-text-muted mt-2">
              أجب على جميع الأسئلة للمتابعة
            </p>
          )}
        </div>
      </div>
    </div>
  );
}