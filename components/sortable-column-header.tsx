"use client"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Column } from "@tanstack/react-table"
import { HTMLAttributes } from 'react'
// Reusable component for sortable column headers
interface SortableColumnHeaderProps<TData> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, unknown>;
  title: string;
}

function SortableColumnHeader<TData>({ column, title, className }: SortableColumnHeaderProps<TData>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting()}
      className={`text-left p-0 hover:bg-transparent ${className}`}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUp className="ml-2 h-4 w-4 opacity-0" />
      )}
    </Button>
  )
}
export { SortableColumnHeader }
export type { SortableColumnHeaderProps } 