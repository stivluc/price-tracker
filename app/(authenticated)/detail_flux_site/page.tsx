"use client"

import { DataTablePagination } from '@/components/data-table-pagination'
import { IconAlertCircle, IconAlertTriangle, IconCheck } from "@tabler/icons-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortableColumnHeader } from "@/components/sortable-column-header"
import { PageHeader } from "@/components/page-header"
import { formatInt, formatPercent } from "@/lib/format"
import { CONCORDANCE, FLOWS, SITES } from "@/lib/demo-data"

type Data = {
  id: number
  site: string
  flow: string
  concordance: number
  divergences: number
  delta: number
}

// One row per flow and site, using the same concordance figures as the overview
const generateFakeData = (): Data[] =>
  FLOWS.flatMap((flow, i) =>
    SITES.map((site, j) => {
      const concordance = CONCORDANCE[i][j]
      return {
        id: i * SITES.length + j,
        site,
        flow,
        concordance,
        divergences: Math.round((100 - concordance) * (900 + Math.random() * 90)),
        delta: +((100 - concordance) * (0.6 + Math.random() * 0.4) + 0.5).toFixed(2),
      }
    })
  )

export default function DetailFluxPage() {
  // Generated on the client only, so the static HTML and hydration match
  const [data, setData] = useState<Data[]>([])
  useEffect(() => setData(generateFakeData()), [])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const pageSize = 10

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "site",
      header: ({ column }) => <SortableColumnHeader column={column} title="Site" />,
    },
    {
      accessorKey: "flow",
      header: ({ column }) => <SortableColumnHeader column={column} title="Flux" />,
    },
    {
      accessorKey: "concordance",
      header: ({ column }) => <SortableColumnHeader column={column} title="Concordance" />,
      cell: ({ row }) => {
        const value = row.getValue("concordance") as number
        let status = {
          icon: IconCheck,
          className: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
        }

        if (value < 85) {
          status = {
            icon: IconAlertCircle,
            className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
          }
        } else if (value < 95) {
          status = {
            icon: IconAlertTriangle,
            className: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
          }
        }

        return (
          <Badge variant="outline" className={status.className}>
            <status.icon className="mr-1 size-3.5" />
            {value} %
          </Badge>
        )
      },
    },
    {
      accessorKey: "divergences",
      header: ({ column }) => <SortableColumnHeader column={column} title="Divergences" />,
      cell: ({ row }) => formatInt(row.getValue<number>("divergences")),
    },
    {
      accessorKey: "delta",
      header: ({ column }) => <SortableColumnHeader column={column} title="Delta moyen" />,
      cell: ({ row }) => formatPercent(row.getValue<number>("delta"), 2),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value: string) => {
      const q = value.toLowerCase()
      return row.original.site.toLowerCase().includes(q) || row.original.flow.toLowerCase().includes(q)
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader title="Détail par flux et site" />

      <Input
        placeholder="Filtrer par site ou flux..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="sm:max-w-xs"
      />
      <div>
      <div className="-mx-4 border-y sm:mx-0 sm:rounded-md sm:border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      </div>
    </div>
  )
}

