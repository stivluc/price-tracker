"use client"

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
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

// Generate more fake data
const generateFakeData = () => {
  const sites = ["Site 1", "Site 2", "Site 3", "Site 4", "Site 5"]
  const flows = ["Flow A", "Flow B", "Flow C", "Flow D", "Flow E"]
  const data = []

  for (let i = 0; i < 100; i++) {
    const site = sites[Math.floor(Math.random() * sites.length)]
    const flow = flows[Math.floor(Math.random() * flows.length)]
    const concordance = Math.floor(Math.random() * 100)
    const divergences = Math.floor(Math.random() * 1000)
    const delta = (Math.random() * 50).toFixed(2)

    data.push({
      id: i,
      site,
      flow,
      concordance,
      divergences,
      delta: `${delta}%`,
    })
  }

  return data
}

export default function DetailFluxPage() {
  // Generate data inside the component
  const [data] = useState(() => generateFakeData())

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const pageSize = 15

  // Define Data type and columns inside the component
  type Data = typeof data[0]

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "site",
      header: ({ column }) => <SortableColumnHeader column={column} title="Site" />,
    },
    {
      accessorKey: "flow",
      header: ({ column }) => <SortableColumnHeader column={column} title="Flow" />,
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

        if (value < 50) {
          status = {
            icon: IconAlertCircle,
            className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
          }
        } else if (value < 75) {
          status = {
            icon: IconAlertTriangle,
            className: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
          }
        }

        return (
          <Badge variant="outline" className={status.className}>
            <status.icon className="mr-1 size-3.5" />
            {value}%
          </Badge>
        )
      },
    },
    {
      accessorKey: "divergences",
      header: ({ column }) => <SortableColumnHeader column={column} title="Divergences" />,
    },
    {
      accessorKey: "delta",
      header: ({ column }) => <SortableColumnHeader column={column} title="Delta" />,
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
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-2xl font-bold ml-2 mt-6">Détail par flux et site</h1>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par site ou flow..."
          value={(table.getColumn("site")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("site")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    // The TableHead is already left-aligned by default, so we can remove the className here.
                    // We will apply the text-left to the Button component inside.
                    // Removed onClick from TableHead as sorting is handled by the Button inside
                  >
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
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Lignes {table.getState().pagination.pageIndex * pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            sur {table.getFilteredRowModel().rows.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}

