import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HeatmapProps {
  data: number[][] // concordance percentages 0-100
  rows: string[]
  cols: string[]
}

const getColor = (value: number) => {
  if (value >= 95) return "bg-green-500/20 text-green-800 dark:text-green-300"
  if (value >= 90) return "bg-yellow-500/25 text-yellow-900 dark:text-yellow-300"
  if (value >= 80) return "bg-orange-500/25 text-orange-900 dark:text-orange-300"
  return "bg-red-500/25 text-red-900 dark:text-red-300"
}

export function Heatmap({ data, rows, cols }: HeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Concordance par flux et site</CardTitle>
        <CardDescription>Taux de concordance des prix sur 30 jours</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full table-fixed border-separate border-spacing-1 text-center text-xs sm:border-spacing-1.5 sm:text-sm">
          <thead>
            <tr>
              <th className="w-14 sm:w-24" />
              {cols.map((col) => (
                <th key={col} className="text-muted-foreground pb-1 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row}>
                <th className="text-left font-medium whitespace-nowrap">{row}</th>
                {cols.map((col, j) => (
                  <td
                    key={col}
                    className={cn("rounded-md py-2 font-medium tabular-nums", getColor(data[i][j]))}
                  >
                    {data[i][j]} %
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
