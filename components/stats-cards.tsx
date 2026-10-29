import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import NumberFlow from "@number-flow/react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatInt } from "@/lib/format"

export type LiveKpis = {
  lines: number
  divergences: number
  concordance: number
  avgDelta: number
}

const PERIOD_DAYS = 30

// Fake live counters: lines and divergences grow together over the 30-day
// window, concordance is derived from them so every figure stays coherent.
export function useLiveKpis(): LiveKpis {
  const [lines, setLines] = useState(2625103)
  const [divergences, setDivergences] = useState(94504)
  const [avgDelta, setAvgDelta] = useState(4.5)

  useEffect(() => {
    const id = setInterval(() => {
      const added = Math.floor(Math.random() * 500) + 100
      setLines((prev) => prev + added)
      setDivergences((prev) => prev + Math.round(added * (0.03 + Math.random() * 0.012)))
      setAvgDelta((prev) => {
        const next = prev + (Math.random() * 0.1 - 0.05)
        return Math.min(5, Math.max(4, Math.round(next * 10) / 10))
      })
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const concordance = Math.round((1 - divergences / lines) * 1000) / 10
  return { lines, divergences, concordance, avgDelta }
}

const oneDecimal = { minimumFractionDigits: 1, maximumFractionDigits: 1 }

type Trend = "up" | "down"

function KpiCard({
  title,
  value,
  badge,
  trend,
  summary,
  detail,
}: {
  title: string
  value: React.ReactNode
  badge: string
  trend: Trend
  summary: string
  detail: React.ReactNode
}) {
  const Icon = trend === "up" ? IconTrendingUp : IconTrendingDown
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <Icon />
            {badge}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium">
          {summary} <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">{detail}</div>
      </CardFooter>
    </Card>
  )
}

export function StatsCards({ kpis }: { kpis: LiveKpis }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <KpiCard
        title={`Lignes traitées (${PERIOD_DAYS} j)`}
        value={<NumberFlow value={kpis.lines} locales="fr-FR" />}
        badge="+12,5 %"
        trend="up"
        summary="En hausse vs mois précédent"
        detail={`Soit ${formatInt(kpis.lines / PERIOD_DAYS)} lignes par jour en moyenne`}
      />
      <KpiCard
        title="Concordance globale"
        value={<NumberFlow value={kpis.concordance} locales="fr-FR" format={oneDecimal} suffix=" %" />}
        badge="-1,2 pt"
        trend="down"
        summary="En baisse vs mois précédent"
        detail="Flux C nécessite une attention particulière"
      />
      <KpiCard
        title={`Divergences (${PERIOD_DAYS} j)`}
        value={<NumberFlow value={kpis.divergences} locales="fr-FR" />}
        badge="+8,1 %"
        trend="up"
        summary="En hausse vs mois précédent"
        detail="Flux C vers Site 2 concentre le plus d'écarts"
      />
      <KpiCard
        title="Delta moyen absolu"
        value={<NumberFlow value={kpis.avgDelta} locales="fr-FR" format={oneDecimal} suffix=" %" />}
        badge="+0,3 pt"
        trend="up"
        summary="En hausse vs mois précédent"
        detail="Delta maximal observé : 48,5 %"
      />
    </div>
  )
}
