interface HeatmapProps {
  data: number[][]; // percentages 0-100
  rows: string[];
  cols: string[];
}

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function Heatmap({ data, rows, cols }: HeatmapProps) {
  const getColor = (value: number) => {
    if (value > 75) return "bg-green-500/25 dark:bg-green-500/30 dark:text-green-400";
    if (value > 50) return "bg-yellow-500/25  dark:bg-yellow-500/30 dark:text-yellow-400";
    if (value > 25) return "bg-orange-500/25 dark:bg-orange-500/30 dark:text-orange-400";
    if (value > 10) return "bg-red-500/25 dark:bg-red-500/30 dark:text-red-400";
    return "bg-gray-500/25 dark:bg-gray-500/30 dark:text-gray-400";
  };

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardContent className="overflow-auto">
          <table className="min-w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-2"></th>
                {cols.map((col) => (
                  <th key={col} className="p-2 text-sm font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row}>
                  <th className="p-2 text-left text-sm font-medium">{row}</th>
                  {cols.map((_, j) => (
                    <td key={j} className="p-1">
                      <div
                        className={`rounded-md p-2 text-xs font-medium dark:bg-card ${getColor(data[i][j])}`}
                      >
                        {data[i][j]}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
