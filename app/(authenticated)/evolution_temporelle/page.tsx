'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import ForecastChart from '@/components/forecast-chart'
import { formatShortDate } from '@/lib/format'

type MismatchData = {
  date: string
  [flow: string]: number | string
}

type ComplianceData = {
  date: string
  complianceRate: number
}

const FLOWS = ['Flux A', 'Flux B', 'Flux C', 'Flux D', 'Flux E', 'Flux F', 'Flux G', 'Flux H']
const MAX_FLOWS = 5
const HISTORY_DAYS = 120

const dayString = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return d.toISOString().slice(0, 10)
}

const generateMismatchData = (): MismatchData[] => {
  const prev = Object.fromEntries(FLOWS.map((f) => [f, Math.floor(Math.random() * 50) + 50]))
  const data: MismatchData[] = []
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const entry: MismatchData = { date: dayString(i) }
    for (const flow of FLOWS) {
      const target = prev[flow] + (Math.random() - 0.5) * 10
      const value = Math.max(30, Math.min(150, Math.round(prev[flow] * 0.8 + target * 0.2)))
      entry[flow] = value
      prev[flow] = value
    }
    data.push(entry)
  }
  return data
}

const generateComplianceData = (): ComplianceData[] => {
  const data: ComplianceData[] = []
  let current = 85
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    current = Math.max(75, Math.min(95, current + (Math.random() - 0.5) * 2))
    if (i % 20 === 0) current = Math.max(75, Math.min(95, current + (Math.random() - 0.5) * 5))
    data.push({ date: dayString(i), complianceRate: +current.toFixed(2) })
  }
  return data
}

const flowColor = (flow: string) => `var(--chart-${FLOWS.indexOf(flow) + 1})`

const complianceChartConfig = {
  complianceRate: { label: 'Taux de conformité', color: 'var(--chart-2)' },
} satisfies ChartConfig

const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const
type Range = keyof typeof RANGES

export default function EvolutionTemporellePage() {
  const [history, setHistory] = React.useState<{
    mismatch: MismatchData[]
    compliance: ComplianceData[]
  } | null>(null)
  const [timeRange, setTimeRange] = React.useState<Range>('30d')
  const [selectedFlows, setSelectedFlows] = React.useState<string[]>(FLOWS.slice(0, 3))

  // Generated on the client only, so the static HTML and hydration match
  React.useEffect(() => {
    setHistory({ mismatch: generateMismatchData(), compliance: generateComplianceData() })
  }, [])

  const days = RANGES[timeRange]
  const mismatchData = React.useMemo(() => history?.mismatch.slice(-days) ?? [], [history, days])
  const complianceData = React.useMemo(() => history?.compliance.slice(-days) ?? [], [history, days])

  const mismatchChartConfig = React.useMemo(
    () =>
      Object.fromEntries(
        selectedFlows.map((flow) => [flow, { label: flow, color: flowColor(flow) }])
      ) as ChartConfig,
    [selectedFlows]
  )

  const flowItems = React.useMemo(() => FLOWS.map((flow) => ({ label: flow, value: flow })), [])

  return (
    <div className='@container/main flex flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <PageHeader title='Évolution temporelle'>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as Range)}>
          <SelectTrigger className='w-[172px]' aria-label='Période'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align='end'>
            <SelectItem value='7d'>7 derniers jours</SelectItem>
            <SelectItem value='30d'>30 derniers jours</SelectItem>
            <SelectItem value='90d'>90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Mismatches par jour et par flux</CardTitle>
          <CardDescription>Jusqu&apos;à {MAX_FLOWS} flux comparés</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            {selectedFlows.map((flow) => (
              <Badge key={flow} variant='outline' className='h-8 gap-1.5 pr-1 pl-2.5 text-xs'>
                <span className='size-2 rounded-[2px]' style={{ backgroundColor: flowColor(flow) }} />
                {flow}
                <button
                  type='button'
                  className='text-muted-foreground hover:text-foreground hover:bg-muted pointer-events-auto rounded-sm p-1'
                  aria-label={`Retirer ${flow}`}
                  onClick={() => setSelectedFlows(selectedFlows.filter((f) => f !== flow))}
                >
                  <X className='size-3.5' />
                </button>
              </Badge>
            ))}
            {selectedFlows.length < MAX_FLOWS && (
              <MultiSelect
                items={flowItems}
                selected={selectedFlows}
                onSelectedChange={(next) => setSelectedFlows(next.slice(0, MAX_FLOWS))}
                placeholder='Ajouter un flux'
                searchPlaceholder='Rechercher...'
                emptyText='Aucun flux trouvé.'
                labelKey='label'
                valueKey='value'
                className='w-40'
                maxSelections={MAX_FLOWS}
              />
            )}
          </div>
          <ChartContainer config={mismatchChartConfig} className='aspect-auto h-[220px] w-full sm:h-[300px]'>
            <BarChart data={mismatchData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatShortDate}
              />
              <YAxis width={36} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={(value) => formatShortDate(value)} />}
              />
              {selectedFlows.map((flow, index) => (
                <Bar
                  key={flow}
                  dataKey={flow}
                  stackId='a'
                  fill={flowColor(flow)}
                  radius={index === selectedFlows.length - 1 ? [2, 2, 0, 0] : 0}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:gap-6 @4xl/main:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Taux de conformité</CardTitle>
            <CardDescription>Moyenne glissante sur 7 jours</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <ChartContainer config={complianceChartConfig} className='aspect-auto min-h-[200px] w-full flex-1 sm:min-h-[240px]'>
              <AreaChart data={complianceData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='complianceGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='var(--color-complianceRate)' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='var(--color-complianceRate)' stopOpacity={0.05} />
                  </linearGradient>
                </defs>
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
                  width={44}
                  domain={[70, 100]}
                  ticks={[70, 80, 90, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}\u00a0%`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelFormatter={(value) => formatShortDate(value)} />}
                />
                <Area
                  type='monotone'
                  dataKey='complianceRate'
                  fill='url(#complianceGradient)'
                  stroke='var(--color-complianceRate)'
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <ForecastChart />
      </div>
    </div>
  )
}
