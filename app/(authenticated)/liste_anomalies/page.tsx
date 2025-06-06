'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SortableColumnHeader } from '@/components/sortable-column-header'
import {
  IconExternalLink,
  IconFileTypeCsv,
  IconFileTypePdf,
} from '@tabler/icons-react'

type Anomaly = {
  id: number
  articleNumber: string
  ean: string
  site: string
  flowType: string
  priceSource: number
  priceTarget: number
  delta: number
  validityDate: string
  status: 'Critique' | 'Alerte' | 'Ok'
}

const generateData = (): Anomaly[] => {
  const sites = ['Site 1', 'Site 2', 'Site 3']
  const flows = ['Flow A', 'Flow B', 'Flow C']
  const statuses: Anomaly['status'][] = ['Critique', 'Alerte', 'Ok']
  const data: Anomaly[] = []

  for (let i = 1; i <= 100; i++) {
    const priceSource = +(Math.random() * 100).toFixed(2)
    const priceTarget = +(Math.random() * 100).toFixed(2)
    const delta = +(priceTarget - priceSource).toFixed(2)

    data.push({
      id: i,
      articleNumber: `ART-${1000 + i}`,
      ean: `${8000000000000 + i}`,
      site: sites[Math.floor(Math.random() * sites.length)],
      flowType: flows[Math.floor(Math.random() * flows.length)],
      priceSource,
      priceTarget,
      delta,
      validityDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString().slice(0, 10),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    })
  }
  return data
}

export default function ListeAnomaliesPage() {
  const [data] = useState(() => generateData())
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const pageSize = 15

  const columns: ColumnDef<Anomaly>[] = [
    {
      accessorKey: 'articleNumber',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='ARTICLE_NUMBER' />
      ),
    },
    {
      accessorKey: 'ean',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='EAN' />
      ),
    },
    {
      accessorKey: 'site',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='SITE' />
      ),
    },
    {
      accessorKey: 'flowType',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='FLOW_TYPE' />
      ),
    },
    {
      accessorKey: 'priceSource',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='PRICE_SOURCE' />
      ),
    },
    {
      accessorKey: 'priceTarget',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='PRICE_TARGET' />
      ),
    },
    {
      accessorKey: 'delta',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='delta' />
      ),
      cell: ({ row }) => `${row.getValue<number>('delta').toFixed(2)}%`,
      filterFn: (row, columnId, value) => {
        const deltaValue = row.getValue<number>(columnId)
        return deltaValue > parseFloat(value)
      },
    },
    {
      accessorKey: 'validityDate',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='date de validité' />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <SortableColumnHeader column={column} title='STATUS' />
      ),
      cell: ({ row }) => {
        const value = row.getValue<Anomaly['status']>('status')
        const statusClasses = {
          Ok: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
          Alerte:
            'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
          Critique:
            'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
        }
        return (
          <Badge variant='outline' className={statusClasses[value]}>
            {value}
          </Badge>
        )
      },
    },
    {
      id: 'ticket',
      header: () => 'Ticket',
      cell: () => (
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-muted/50'
          asChild
        >
          <a href='#' aria-label='Ouvrir le ticket'>
            <IconExternalLink className='size-4' />
          </a>
        </Button>
      ),
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

  const exportCSV = () => {
    const headers = columns
      .filter((c) => c.accessorKey)
      .map((c) => c.accessorKey)
      .join(',')
    const rows = table.getFilteredRowModel().rows.map((row) =>
      columns
        .filter((c) => c.accessorKey)
        .map((c) => String(row.getValue(c.accessorKey as keyof Anomaly)))
        .join(',')
    )
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'anomalies.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportPDF = () => {
    alert('Export PDF non disponible dans cette démo')
  }

  return (
    <div className='px-4 lg:px-6'>
      <h1 className='text-2xl font-bold ml-2 mt-6'>Liste des anomalies</h1>

      <div className='flex flex-wrap items-end gap-4 py-4'>
        <Input
          placeholder='Filtrer par article...'
          value={(table.getColumn('articleNumber')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('articleNumber')?.setFilterValue(event.target.value)
          }
          className='max-w-xs'
        />
        <Select
          onValueChange={(value) => table.getColumn('flowType')?.setFilterValue(value)}
          value={(table.getColumn('flowType')?.getFilterValue() as string) ?? ''}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Flux' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>Tous</SelectItem>
            <SelectItem value='Flow A'>Flow A</SelectItem>
            <SelectItem value='Flow B'>Flow B</SelectItem>
            <SelectItem value='Flow C'>Flow C</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => table.getColumn('site')?.setFilterValue(value)}
          value={(table.getColumn('site')?.getFilterValue() as string) ?? ''}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Site' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>Tous</SelectItem>
            <SelectItem value='Site 1'>Site 1</SelectItem>
            <SelectItem value='Site 2'>Site 2</SelectItem>
            <SelectItem value='Site 3'>Site 3</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type='number'
          placeholder='Delta > X'
          value={(table.getColumn('delta')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('delta')?.setFilterValue(event.target.value)
          }
          className='w-24'
        />
        <Select
          onValueChange={(value) => table.getColumn('status')?.setFilterValue(value)}
          value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Statut' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>Tous</SelectItem>
            <SelectItem value='Ok'>Ok</SelectItem>
            <SelectItem value='Alerte'>Alerte</SelectItem>
            <SelectItem value='Critique'>Critique</SelectItem>
          </SelectContent>
        </Select>
        <div className='ml-auto flex gap-2'>
          <Button variant='outline' size='sm' onClick={exportCSV}>
            <IconFileTypeCsv className='mr-1 size-4' /> CSV
          </Button>
          <Button variant='outline' size='sm' onClick={exportPDF}>
            <IconFileTypePdf className='mr-1 size-4' /> PDF
          </Button>
        </div>
      </div>

      <div className='rounded-md border'>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          <p className='text-sm text-muted-foreground'>
            Lignes {table.getState().pagination.pageIndex * pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            sur {table.getFilteredRowModel().rows.length}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <div className='flex items-center gap-1'>
            <span className='text-sm text-muted-foreground'>
              Page {table.getState().pagination.pageIndex + 1} sur{' '}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant='outline'
            size='sm'
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
