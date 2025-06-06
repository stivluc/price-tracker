interface HeatmapProps {
  data: number[][]; // percentages 0-100
  rows: string[];
  cols: string[];
}

export function Heatmap({ data, rows, cols }: HeatmapProps) {
  const getColor = (value: number) => {
    if (value > 75) return "bg-red-500";
    if (value > 50) return "bg-orange-400";
    if (value > 25) return "bg-yellow-300";
    return "bg-green-400";
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="p-2"></th>
            {cols.map(col => (
              <th key={col} className="p-2 text-sm font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row}>
              <th className="p-2 text-sm font-medium text-left">{row}</th>
              {cols.map((_, j) => (
                <td key={j} className="p-1">
                  <div
                    className={`${getColor(data[i][j])} text-xs text-white rounded-md p-2`}
                  >
                    {data[i][j]}%
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
