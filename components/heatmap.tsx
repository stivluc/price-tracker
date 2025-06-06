interface HeatmapProps {
  data: number[][]; // percentages 0-100
  rows: string[];
  cols: string[];
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Heatmap({ data, rows, cols }: HeatmapProps) {
  const getColor = (value: number) => {
    if (value > 75) return "var(--chart-1)";
    if (value > 50) return "var(--chart-2)";
    if (value > 25) return "var(--chart-3)";
    if (value > 10) return "var(--chart-4)";
    return "var(--chart-5)";
  };

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Concordance par flow / site</CardTitle>
        </CardHeader>
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
                        style={{ backgroundColor: getColor(data[i][j]) }}
                        className="rounded-md p-2 text-xs font-medium text-card-foreground"
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
