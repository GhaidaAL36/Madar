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

export type ProblemType = "قيمة مفقودة" | "قيمة خاطئة" | "صف مكرر" | "أخرى";

export interface DataProblem {
  id: string;
  row: string;
  column: string;
  problemType: ProblemType;
  fix: string;
}

export interface DataReport {
  problems: DataProblem[];
  conclusion: string;
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
}