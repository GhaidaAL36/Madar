import type { DataRow } from "@/types/DataTask";
import "@/style/scrollbar.css";

interface Props {
  columns: string[];
  rows: DataRow[];
}

export default function TableTab({ columns, rows }: Props) {
  return (
    <div className="custom-scrollbar overflow-auto h-full">
      <table className="w-full text-sm border-collapse min-w-max">
        <thead>
          <tr className="bg-bg-dark sticky top-0">
            {columns.map((col) => (
              <th
                key={col}
                className="text-right px-4 py-3 text-[12px] font-bold text-bg-light-secondary border-b border-white/8 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/5 hover:bg-white/3 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-3 text-[13px] text-text-muted text-right whitespace-nowrap"
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
