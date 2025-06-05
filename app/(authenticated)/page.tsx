"use client"

import React from "react"

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </main>
    </div>
  )
} 