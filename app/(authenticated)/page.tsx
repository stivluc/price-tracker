"use client"

import React from "react"
import { StatsCards } from "@/components/stats-cards"
import { Heatmap } from "@/components/heatmap"
import { StatusBanner } from "@/components/status-banner"

export default function HomePage() {

  const flows = ["Flow A", "Flow B", "Flow C", "Flow D", "Flow E"]
  const sites = ["Site 1", "Site 2", "Site 3", "Site 4"]
  const data = [
    [95, 27, 90, 97],
    [52, 76, 80, 70],
    [60, 55, 58, 63],
    [40, 5, 92, 28],
    [78, 91, 22, 96],
  ]
  const matchRate = 96.4

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-bold ml-8">Indicateurs clés</h1>
          <StatsCards />
          <h2 className="text-lg font-bold ml-8 mt-2">Heatmap - Concordance par flux et site</h2>
          <Heatmap data={data} rows={flows} cols={sites} />
          <StatusBanner value={100 - matchRate} />
        </div>
      </div>
    </div>
  )
}
