import { cn } from "@/lib/utils"

interface LineChartSeries {
  label: string
  data: number[]
  color?: string
  dashed?: boolean
}

interface SimpleLineChartProps {
  series: LineChartSeries[]
  height?: number
  className?: string
}

export function SimpleLineChart({
  series,
  height = 200,
  className,
}: SimpleLineChartProps) {
  if (!series.length) return null
  const all = series.flatMap((s) => s.data)
  const max = Math.max(...all)
  const min = Math.min(...all)
  const range = max - min || 1
  const len = Math.max(...series.map((s) => s.data.length))
  const width = len - 1

  const y = (v: number) => (1 - (v - min) / range) * height

  const buildPath = (data: number[]) =>
    data
      .map((v, i) => `${i === 0 ? "M" : "L"}${i} ${y(v)}`)
      .join(" ")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full overflow-visible", className)}
      preserveAspectRatio="none"
    >
      {series.map((s, i) => (
        <path
          key={i}
          d={buildPath(s.data)}
          fill="none"
          stroke={s.color || `var(--color-chart-${i + 1})`}
          strokeWidth={2}
          strokeDasharray={s.dashed ? "4 2" : undefined}
        />
      ))}
    </svg>
  )
}
