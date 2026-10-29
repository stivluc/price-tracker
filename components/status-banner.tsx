import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPercent } from "@/lib/format"

interface StatusBannerProps {
  value: number // share of divergent lines, in %
  threshold?: number // "Critique" above this value, "Alerte" above half of it
}

export function StatusBanner({ value, threshold = 10 }: StatusBannerProps) {
  let status = {
    className: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    label: "Stable",
    desc: "Le système fonctionne normalement",
  }

  if (value > threshold) {
    status = {
      className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      label: "Critique",
      desc: "Trop de divergences détectées",
    }
  } else if (value > threshold / 2) {
    status = {
      className: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      label: "Alerte",
      desc: "Des divergences nécessitent une attention",
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut général du système</CardTitle>
        <CardDescription>
          {status.desc} ({formatPercent(value)} de divergences)
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
