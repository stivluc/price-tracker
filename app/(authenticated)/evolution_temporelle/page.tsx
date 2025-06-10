'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleLineChart } from '@/components/simple-line-chart'

export default function EvolutionTemporellePage() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1)
  const flows = ['Flow A', 'Flow B', 'Flow C']
  const mismatchesSeries = flows.map((label, idx) => ({
    label,
    data: days.map(() => Math.floor(Math.random() * 20) + 5),
  }))

  const conformitySeries = [
    {
      label: 'Taux de conformité',
      data: days.map(() => 80 + Math.random() * 20),
    },
  ]

  const totals = days.map((_, i) =>
    mismatchesSeries.reduce((sum, s) => sum + s.data[i], 0)
  )
  const forecastDays = 7
  const forecastSeries = {
    label: 'Prévision',
    data: Array.from({ length: forecastDays }, (_, i) =>
      Math.max(0, totals[totals.length - 1] + (i + 1) * (Math.random() * 6 - 3))
    ),
    dashed: true,
  }
  const forecastLabels = [
    ...days,
    ...Array.from({ length: forecastDays }, (_, i) => days.length + i + 1),
  ]
  const actualSeries = {
    label: 'Mismatches',
    data: totals,
  }

  return (
    <div className='flex flex-col gap-4 px-4 py-4 lg:px-6'>
      <h1 className='ml-2 mt-2 text-2xl font-bold'>Évolution temporelle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mismatches par jour / par flux</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart series={mismatchesSeries} />
          <div className='mt-2 flex gap-4 text-sm'>
            {mismatchesSeries.map((s, i) => (
              <div key={i} className='flex items-center gap-1'>
                <span
                  className='h-2 w-2 rounded-full'
                  style={{ backgroundColor: `var(--color-chart-${i + 1})` }}
                />
                {s.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courbe du taux de conformité rolling 7j</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart series={conformitySeries} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zone de forecasting (alertes précoces)</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart series={[actualSeries, forecastSeries]} />
        </CardContent>
      </Card>
    </div>
  )
}
