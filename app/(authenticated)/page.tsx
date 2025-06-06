"use client"

import React from "react"
import { StatsCards } from "@/components/stats-cards"
import { Heatmap } from "@/components/heatmap"
import { StatusBanner } from "@/components/status-banner"

export default function HomePage() {
  const totalRecords = 123456
  const matchRate = 86.4
  const discrepancies = 2345
  const avgDelta = 4.2

  const flows = ["Flow A", "Flow B", "Flow C"]
  const sites = ["Site 1", "Site 2", "Site 3"]
  const data = [
    [10, 20, 5],
    [30, 40, 15],
    [50, 60, 20],
  ]

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
