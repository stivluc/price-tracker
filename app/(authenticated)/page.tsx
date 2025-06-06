"use client"

import React from "react"
import { StatsCard } from "@/components/stats-card"
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
    <div className="flex flex-col w-full h-full">
      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <StatsCard title="Enregistrements" value={totalRecords} />
            <StatsCard title="% concordance" value={`${matchRate}%`} />
            <StatsCard title="Discrepancies" value={discrepancies} />
            <StatsCard title="Delta moyen" value={avgDelta} />
          </div>
          <Heatmap data={data} rows={flows} cols={sites} />
          <StatusBanner value={100 - matchRate} />
        </div>
      </main>
    </div>
  )
}
