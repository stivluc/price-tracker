import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

// 90 days of history, or the last 30 when the card is too narrow for thin ticks
const DAYS = 90
const SHORT_DAYS = 30

type DayState = "ok" | "degraded" | "down"

// Fake status history: past incidents per component, as days ago -> state.
// Fixed values, so the static HTML and the client render match.
const COMPONENTS: { name: string; incidents: Record<number, DayState> }[] = [
  { name: "Ingestion des flux", incidents: { 37: "down", 63: "degraded" } },
  { name: "Moteur de comparaison", incidents: { 5: "degraded", 48: "degraded" } },
  { name: "Alertes", incidents: { 21: "degraded" } },
  { name: "API", incidents: {} },
  { name: "Exports", incidents: { 74: "down" } },
]

// Share of the day the component was available, for the uptime figure
const AVAILABILITY: Record<DayState, number> = { ok: 1, degraded: 0.98, down: 0.9 }

const TICK: Record<DayState, string> = {
  ok: "bg-green-500/80",
  degraded: "bg-amber-400",
  down: "bg-red-500",
}

const LABEL: Record<DayState, string> = {
  ok: "Aucun incident",
  degraded: "Performances dégradées",
  down: "Interruption partielle",
}

const uptime = (incidents: Record<number, DayState>, days: number) => {
  let total = 0
  for (let ago = 0; ago < days; ago++) total += AVAILABILITY[incidents[ago] ?? "ok"]
  return (total / days) * 100
}

const daysAgo = (n: number) => (n === 0 ? "Aujourd'hui" : n === 1 ? "Hier" : `Il y a ${n} jours`)

export function StatusBanner({ className }: { className?: string }) {
  return (
    <Card bleed className={className}>
      <CardHeader>
        <CardTitle>Statut général du système</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-green-500" />
          <span className="text-foreground font-medium">Tous les systèmes sont opérationnels</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="@container/status flex flex-col gap-5">
        <ul className="flex flex-col gap-4 sm:gap-3">
          {COMPONENTS.map(({ name, incidents }) => (
            <li
              key={name}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 text-sm sm:grid-cols-[11rem_1fr_4.5rem] sm:gap-x-6"
            >
              <div className="flex min-w-0 items-baseline gap-2 sm:block">
                <div className="truncate font-medium">{name}</div>
                <div className="shrink-0 text-xs text-green-600 dark:text-green-400">Opérationnel</div>
              </div>
              <div
                className="order-last col-span-2 flex h-6 gap-[2px] sm:h-7 sm:order-none sm:col-span-1"
                role="img"
                aria-label={`Disponibilité de ${name}`}
              >
                {Array.from({ length: DAYS }, (_, i) => {
                  const ago = DAYS - 1 - i
                  const state = incidents[ago] ?? "ok"
                  return (
                    <span
                      key={ago}
                      title={`${daysAgo(ago)} : ${LABEL[state]}`}
                      className={cn("flex-1 rounded-[1px]", TICK[state], ago >= SHORT_DAYS && "@max-3xl/status:hidden")}
                    />
                  )
                })}
              </div>
              <span className="text-muted-foreground text-right tabular-nums">
                <span className="@3xl/status:hidden">{formatPercent(uptime(incidents, SHORT_DAYS), 2)}</span>
                <span className="@max-3xl/status:hidden">{formatPercent(uptime(incidents, DAYS), 2)}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="text-muted-foreground -mt-2 flex justify-between text-xs sm:pr-[6rem] sm:pl-[12.5rem]">
          <span>
            Il y a <span className="@3xl/status:hidden">{SHORT_DAYS}</span>
            <span className="@max-3xl/status:hidden">{DAYS}</span> jours
          </span>
          <span>Aujourd&apos;hui</span>
        </div>
        <p className="text-muted-foreground border-t pt-4 text-sm">
          Dernier incident : performances dégradées du moteur de comparaison, il y a 5 jours.{" "}
          <Link href="/alertes_incidents" className="text-foreground font-medium underline-offset-4 hover:underline">
            Voir les incidents
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
