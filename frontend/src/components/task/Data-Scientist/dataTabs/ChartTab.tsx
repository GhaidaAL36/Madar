import {
  LineChart, BarChart,
  Line, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { ChartPoint, ChartType } from "@/types/DataTask";

interface Props {
  chartType: ChartType;
  chartData: ChartPoint[];
}

const CHART_COLOR = "var(--color-teal)";
const GRID_COLOR  = "rgba(255,255,255,0.06)";
const AXIS_COLOR  = "rgba(255,255,255,0.3)";

const toRechartsData = (data: ChartPoint[]) =>
  data.map((d) => ({ name: d.label, value: d.value }));

export default function ChartTab({ chartType, chartData }: Props) {
  const data = toRechartsData(chartData);

  const sharedProps = {
    data,
    margin: { top: 16, right: 24, left: 0, bottom: 8 },
  };

  const sharedAxisProps = {
    tick: { fill: AXIS_COLOR, fontSize: 11 },
    axisLine: { stroke: GRID_COLOR },
    tickLine: false,
  };

  return (
    <div className="h-full flex items-center justify-center p-6" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart {...sharedProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="name" {...sharedAxisProps} />
            <YAxis {...sharedAxisProps} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A3A4A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLOR}
              strokeWidth={2.5}
              dot={{ fill: CHART_COLOR, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart {...sharedProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="name" {...sharedAxisProps} />
            <YAxis {...sharedAxisProps} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A3A4A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="value"
              fill={CHART_COLOR}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
