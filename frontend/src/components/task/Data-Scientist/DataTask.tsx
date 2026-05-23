import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataTask } from "@/hooks/useDataTaskApi";
import { taskService } from "@/services/taskService";
import TableTab from "./dataTabs/TableTab";
import ChartTab from "./dataTabs/ChartTab";
import StatsTab from "./dataTabs/StatsTab";
import HintsPanel from "../HintsPanel";
import DataAnswerPanel from "./DataAnswerPanel";
import AnalysisAnswerPanel from "./AnalysisAnswerPanel";
import type { DataReport } from "@/types/DataTask";
import type { AnalysisReport } from "./AnalysisAnswerPanel";
import "@/style/scrollbar.css";

type TabKey = "table" | "chart" | "stats";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "table", label: "الجدول",        icon: "fa-table"      },
  { key: "chart", label: "الرسم البياني", icon: "fa-chart-line" },
  { key: "stats", label: "الإحصاء",       icon: "fa-chart-bar"  },
];

interface Props {
  jobId: string;
  taskDbId: number;
  simulationId: string;
  generatedContent: any;
  taskType: "clean_data" | "data_analyst";
}

export default function DataTask({ jobId, taskDbId, simulationId, taskType }: Props) {
  const navigate = useNavigate();
  const { dataTask, loading, error } = useDataTask(jobId, String(taskDbId));
  const [activeTab, setActiveTab] = useState<TabKey>("table");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitClean = async (report: DataReport) => {
    setSubmitting(true);
    try {
      await taskService.submitSimulation(jobId, String(taskDbId), simulationId, {
        questions: [],
        user_answers: { problems: report.problems, conclusion: report.conclusion },
      });
      navigate(`/jobs/${jobId}/tasks/${taskDbId}/review?sim=${simulationId}&task=${taskDbId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnalysis = async (report: AnalysisReport) => {
    setSubmitting(true);
    try {
      await taskService.submitSimulation(jobId, String(taskDbId), simulationId, {
        questions: [],
        user_answers: { insights: report.insights, conclusion: report.conclusion },
      });
      navigate(`/jobs/${jobId}/tasks/${taskDbId}/review?sim=${simulationId}&task=${taskDbId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-text-muted text-sm">
      جارٍ التحميل...
    </div>
  );

  if (error || !dataTask) return (
    <div className="flex flex-1 items-center justify-center bg-bg-dark text-red-400 text-sm">
      {error ?? "فشل تحميل البيانات"}
    </div>
  );

  return (
    <div className="flex flex-1 h-full bg-bg-dark overflow-hidden custom-scrollbar">

      {/* Left — data */}
      <div className="flex flex-col flex-1 min-w-0 border-l border-white/8">

        {/* Tab bar */}
        <div dir="rtl" className="flex items-center gap-1 px-4 py-2 border-b border-white/8 shrink-0">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer border-0 ${
                  isActive
                    ? "bg-white/10 text-text-on-dark"
                    : "bg-transparent text-text-muted hover:text-text-on-dark"
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-[11px]`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-auto min-h-0">
          {activeTab === "table" && <TableTab columns={dataTask.columns} rows={dataTask.rows} />}
          {activeTab === "chart" && <ChartTab chartType={dataTask.chartType} chartData={dataTask.chartData} />}
          {activeTab === "stats" && <StatsTab stats={dataTask.stats} />}
        </div>

        <HintsPanel hints={dataTask.keyFindings} />
      </div>

      {/* Right — answer panel */}
      <div className="flex flex-col w-96 shrink-0 h-full overflow-hidden border-r border-white/8">
        {taskType === "clean_data" ? (
          <DataAnswerPanel
            columns={dataTask.columns}
            rows={dataTask.rows}
            onSubmit={handleSubmitClean}
            submitting={submitting}
          />
        ) : (
          <AnalysisAnswerPanel
            onSubmit={handleSubmitAnalysis}
            submitting={submitting}
          />
        )}
      </div>

    </div>
  );
}