"use client"

import { StatsCards, useLiveKpis } from "@/components/stats-cards"
import { Heatmap } from "@/components/heatmap"
import { StatusBanner } from "@/components/status-banner"
import { PageHeader } from "@/components/page-header"
import { CONCORDANCE, FLOWS, SITES } from "@/lib/demo-data"


export default function HomePage() {
  const kpis = useLiveKpis()

  return (
    <div className="@container/main flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader title="Vue d'ensemble" />
      <StatsCards kpis={kpis} />
      <Heatmap data={CONCORDANCE} rows={FLOWS} cols={SITES} />
      <StatusBanner value={100 - kpis.concordance} />
    </div>
  )
}
