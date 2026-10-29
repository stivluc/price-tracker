"use client"

import type { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, total)
  const pageCount = Math.max(table.getPageCount(), 1)

  return (
    <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
      <p className="text-muted-foreground text-xs tabular-nums sm:text-sm">
        <span className="sm:hidden">
          {from}–{to} / {total}
        </span>
        <span className="hidden sm:inline">
          Lignes {from}–{to} sur {total}
        </span>
      </p>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 sm:inline-flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="Première page"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-9 sm:size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Page précédente"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-14 text-center text-xs font-medium tabular-nums sm:text-sm">
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-9 sm:size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Page suivante"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 sm:inline-flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Dernière page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
