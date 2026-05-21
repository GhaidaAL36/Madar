export type ChartType = "bar" | "line";

export type DataRow = Record<string, string | number>;

export interface ChartPoint {
  label: string;
  value: number;
}

export interface StatItem {
  label: string;
  value: string | number;
}

export interface DataTaskData {
  instructions: string;
  chartType: ChartType;
  columns: string[];
  rows: DataRow[];
  chartData: ChartPoint[];
  stats: StatItem[];
  keyFindings: string[];
  hints: string[];
  questions: { id: number; question: string }[];
}