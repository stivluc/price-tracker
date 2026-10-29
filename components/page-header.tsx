import * as React from "react"

export function PageHeader({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
      {children}
    </div>
  )
}
