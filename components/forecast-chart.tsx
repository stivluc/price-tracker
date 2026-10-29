'use client'

import React, { useEffect, useState } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatDecimal, formatShortDate } from '@/lib/format'

const ALERT_THRESHOLD = 50
const HISTORY_DAYS = 30
const FORECAST_DAYS = 7

type Point = {
  date: string
  real?: number
  forecast?: number
  band?: [number, number]
}

const dayString = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

const generateReal = () =>
  Array.from({ length: HISTORY_DAYS }, (_, i) => ({
    date: dayString(i - HISTORY_DAYS + 1),
    value: Math.round(20 + 10 * Math.sin(i / 5) + Math.random() * 5),
  }))

const generateForecast = (real: { date: string; value: number }[]) => {
  const recent = real.slice(-10)
  const last = real[real.length - 1].value
  let slope = (recent[recent.length - 1].value - recent[0].value) / (recent.length - 1)

  // Nudge the trend upwards when close to the threshold, so the demo shows drift
  if (last >= ALERT_THRESHOLD * 0.75 && slope < 0.5) slope = 0.5 + Math.random() * 0.5
  else if (last >= ALERT_THRESHOLD * 0.6 && Math.random() < 0.7 && slope < 0.2)
    slope = 0.2 + Math.random() * 0.3

  return Array.from({ length: FORECAST_DAYS }, (_, i) => {
    const value = Math.max(10, Math.min(100, last + (i + 1) * slope + (Math.random() - 0.5) * 2))
    const margin = value * 0.1
    return {
      date: dayString(i + 1),
      value: Math.round(value),
      lower: Math.round(value - margin),
      upper: Math.round(value + margin),
    }
  })
}

const chartConfig = {
  real: { label: 'Réel', color: 'var(--chart-3)' },
  forecast: { label: 'Prévision', color: 'var(--chart-1)' },
  band: { label: 'Intervalle', color: 'var(--chart-1)' },
  threshold: { label: "Seuil d'alerte", color: 'var(--destructive)' },
} satisfies ChartConfig

const legendPayload = (['real', 'forecast', 'threshold'] as const).map((key) => ({
  value: key,
  dataKey: key,
  type: 'square' as const,
  color: chartConfig[key].color,
}))

export default function ForecastChart() {
  const [data, setData] = useState<Point[]>([])
  const [slope, setSlope] = useState<number | null>(null)
  const [crossing, setCrossing] = useState<string | null>(null)

  useEffect(() => {
    const real = generateReal()
    const forecast = generateForecast(real)
    const last = real[real.length - 1]

    setData([
      ...real.slice(0, -1).map((d) => ({ date: d.date, real: d.value })),
      // Junction point so the forecast line continues from the last real value
      { date: last.date, real: last.value, forecast: last.value, band: [last.value, last.value] },
      ...forecast.map((d) => ({ date: d.date, forecast: d.value, band: [d.lower, d.upper] as [number, number] })),
    ])

    const week = real.slice(-7)
    setSlope((week[week.length - 1].value - week[0].value) / (week.length - 1))
    const hit = forecast.find((d) => d.value >= ALERT_THRESHOLD)
    setCrossing(hit ? new Date(hit.date).toLocaleDateString('fr-FR') : null)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévision à {FORECAST_DAYS} jours</CardTitle>
        <CardDescription>Mismatches quotidiens et seuil d&apos;alerte</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[200px] w-full sm:h-[240px]'>
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatShortDate}
            />
            <YAxis
              width={28}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, (max: number) => Math.max(ALERT_THRESHOLD + 10, Math.ceil(max / 10) * 10)]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => formatShortDate(value)} />}
            />
            <ReferenceLine
              y={ALERT_THRESHOLD}
              stroke='var(--color-threshold)'
              strokeDasharray='4 4'
            />
            <Area
              dataKey='band'
              stroke='none'
              fill='var(--color-band)'
              fillOpacity={0.15}
              legendType='none'
              tooltipType='none'
              activeDot={false}
              isAnimationActive={false}
            />
            <Line dataKey='real' stroke='var(--color-real)' strokeWidth={2} dot={false} />
            <Line
              dataKey='forecast'
              stroke='var(--color-forecast)'
              strokeWidth={2}
              strokeDasharray='5 4'
              dot={false}
            />
            <ChartLegend payload={legendPayload} content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <div className='text-muted-foreground text-xs'>Tendance sur 7 jours</div>
            <div className='font-medium tabular-nums'>
              {slope === null ? '-' : `${slope > 0 ? '+' : ''}${formatDecimal(slope)} / jour`}
            </div>
          </div>
          <div>
            <div className='text-muted-foreground text-xs'>Franchissement du seuil</div>
            <div className='font-medium tabular-nums'>{crossing ?? 'Non prévu'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
