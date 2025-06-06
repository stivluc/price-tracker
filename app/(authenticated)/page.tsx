"use client"

import React from "react"
import { StatsCards } from "@/components/stats-cards"
import { Heatmap } from "@/components/heatmap"
import { StatusBanner } from "@/components/status-banner"

export default function HomePage() {

  const flows = ["Flow A", "Flow B", "Flow C", "Flow D", "Flow E"]
  const sites = ["Site 1", "Site 2", "Site 3", "Site 4"]
  const data = [
    [95, 88, 90, 85],
    [82, 76, 80, 70],
    [60, 55, 58, 63],
    [40, 35, 38, 33],
    [20, 25, 22, 18],
  ]
  const matchRate = 96.4

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <StatsCards />
          <Heatmap data={data} rows={flows} cols={sites} />
          <StatusBanner value={100 - matchRate} />
        </div>
      </div>
    </div>
  )
}
