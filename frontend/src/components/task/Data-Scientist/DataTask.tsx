import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDataTask } from "@/hooks/useDataTaskApi";
import TableTab from "./dataTabs/TableTab";
import ChartTab from "./dataTabs/ChartTab";
import StatsTab from "./dataTabs/StatsTab";
import AnswerPanel from "./AnswerPanel";
import HintsPanel from "../HintsPanel";

type TabKey = "table" | "chart" | "stats";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "table", label: "الجدول", icon: "fa-table" },
  { key: "chart", label: "الرسم البياني", icon: "fa-chart-line" },
  { key: "stats", label: "الإحصاء", icon: "fa-chart-bar" },
];

const LABELS = {
  typeBadge: "تحليل بيانات",
  badgeColor: "bg-teal/15 text-teal border-teal/25",
} as const;

export default function DataTask() {
  const { jobId, taskId } = useParams<{ jobId: string; taskId: string }>();
  const { dataTask, loading, error } = useDataTask(jobId ?? "", taskId ?? "");
  const [activeTab, setActiveTab] = useState<TabKey>("table");

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

  const renderTab = () => {
    switch (activeTab) {
      case "table": return <TableTab columns={dataTask.columns} rows={dataTask.rows} />;
      case "chart": return <ChartTab chartType={dataTask.chartType} chartData={dataTask.chartData} />;
      case "stats": return <StatsTab stats={dataTask.stats} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-bg-dark overflow-hidden">
      <div
        dir="rtl"
        className="flex items-start gap-4 px-5 py-4 border-b border-white/8 shrink-0"
      >
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 mt-0.5 ${LABELS.badgeColor}`}>
          {LABELS.typeBadge}
        </span>
      </div>

      <div
        dir="rtl"
        className="flex items-center gap-1 px-4 py-2 border-b border-white/8 shrink-0 bg-bg-dark"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer border-0 ${
                isActive
                  ? "bg-white/10 text-text-on-dark"
                  : "bg-transparent text-text-muted hover:text-text-on-dark"
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-[12px]`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden">{renderTab()}</div>

      <AnswerPanel />

      <HintsPanel hints={dataTask.hints} />
    </div>
  );
}