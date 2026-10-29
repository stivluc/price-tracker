'use client'

import { DataTablePagination } from '@/components/data-table-pagination'
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
  Row,
} from '@tanstack/react-table'
import { useState, useEffect, useMemo } from 'react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SortableColumnHeader } from '@/components/sortable-column-header'
import {
  IconExternalLink,
  IconFileTypeCsv,
  IconFileTypePdf,
} from '@tabler/icons-react'
import { PageHeader } from '@/components/page-header'
import { formatEuro, formatPercent } from '@/lib/format'

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
  status: 'Alerte' | 'Critique'
}

const generateData = (): Anomaly[] => {
  const sites = ['Site 1', 'Site 2', 'Site 3']
  const flows = ['Flux A', 'Flux B', 'Flux C']
  const data: Anomaly[] = []

  for (let i = 1; i <= 100; i++) {
    const priceSource = +(Math.random() * 95 + 5).toFixed(2)
    // Relative gap between the two flows, between 5 % and 45 % either way
    const gap = (Math.random() * 40 + 5) * (Math.random() < 0.5 ? -1 : 1)
    const priceTarget = +(priceSource * (1 + gap / 100)).toFixed(2)
    const delta = +(((priceTarget - priceSource) / priceSource) * 100).toFixed(2)
    const ean = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')

    data.push({
      id: i,
      articleNumber: `ART-${1000 + i}`,
      ean,
      site: sites[Math.floor(Math.random() * sites.length)],
      flowType: flows[Math.floor(Math.random() * flows.length)],
      priceSource,
      priceTarget,
      delta,
      validityDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString().slice(0, 10),
      status: Math.abs(delta) > 30 ? 'Critique' : 'Alerte',
    })
  }
  return data
}

// Custom global filter function for article number and EAN
const articleEanFilter = (
  row: Row<Anomaly>,
  columnId: string,
  filterValue: string
) => {
  const search = filterValue.toLowerCase()
  const articleNumber = row.getValue<string>('articleNumber').toLowerCase()
  const ean = row.getValue<string>('ean').toLowerCase()

  return articleNumber.includes(search) || ean.includes(search)
}

export default function ListeAnomaliesPage() {
  const [data, setData] = useState<Anomaly[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const pageSize = 10
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: '', description: '' })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  useEffect(() => {
    setData(generateData())
  }, [])

  const columns: ColumnDef<Anomaly>[] = useMemo(
    () => [
      {
        accessorKey: 'articleNumber',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Article' />
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
          <SortableColumnHeader column={column} title='Site' />
        ),
      },
      {
        accessorKey: 'flowType',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Flux' />
        ),
      },
      {
        accessorKey: 'priceSource',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Prix source' />
        ),
        cell: ({ row }) => formatEuro(row.getValue<number>('priceSource')),
      },
      {
        accessorKey: 'priceTarget',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Prix cible' />
        ),
        cell: ({ row }) => formatEuro(row.getValue<number>('priceTarget')),
      },
      {
        accessorKey: 'delta',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Delta' />
        ),
        cell: ({ row }) => {
          const delta = row.getValue<number>('delta')
          return `${delta > 0 ? '+' : ''}${formatPercent(delta, 2)}`
        },
        filterFn: (row, columnId, value) => {
          const min = parseFloat(value)
          return Number.isNaN(min) || Math.abs(row.getValue<number>(columnId)) > min
        },
      },
      {
        accessorKey: 'validityDate',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Date de validité' />
        ),
        cell: ({ row }) => new Date(row.getValue<string>('validityDate')).toLocaleDateString('fr-FR'),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Statut' />
        ),
        cell: ({ row }) => {
          const value = row.getValue<Anomaly['status']>('status')
          const statusClasses = {
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
        filterFn: (row, columnId, value) => {
            const status = row.getValue<Anomaly['status']>(columnId);
            return value === 'all' || status === value;
        }
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
    ],
    [] // Memoize columns
  )

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
    globalFilterFn: articleEanFilter,
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

  const exportCSV = () => {
    setIsDownloading(true)
    const csvColumns: [keyof Anomaly, string][] = [
      ['articleNumber', 'Article'],
      ['ean', 'EAN'],
      ['site', 'Site'],
      ['flowType', 'Flux'],
      ['priceSource', 'Prix source'],
      ['priceTarget', 'Prix cible'],
      ['delta', 'Delta (%)'],
      ['validityDate', 'Date de validité'],
      ['status', 'Statut'],
    ]
    const headers = csvColumns.map(([, label]) => label).join(';')
    const rows = table.getFilteredRowModel().rows.map(row =>
      csvColumns.map(([key]) => String(row.original[key])).join(';')
    )

    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'anomalies.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false)
    setDownloadSuccess(true)
    setTimeout(() => {
      setDownloadSuccess(false)
    }, 2000)
  };

  const exportPDF = () => {
    setDialogContent({
      title: "Export PDF",
      description: "L'export PDF n'est pas disponible dans la démo."
    })
    setShowDialog(true)
  }

  return (
    <div className='flex flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <PageHeader title='Liste des anomalies' />

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDialog(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end sm:gap-4'>
        <Input
          placeholder='Rechercher par article ou EAN...'
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='col-span-2 sm:max-w-xs'
        />
        <Select
          onValueChange={(value) => table.getColumn('flowType')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('flowType')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Type de flux' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les flux</SelectItem>
            <SelectItem value='Flux A'>Flux A</SelectItem>
            <SelectItem value='Flux B'>Flux B</SelectItem>
            <SelectItem value='Flux C'>Flux C</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => table.getColumn('site')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('site')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Site' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les sites</SelectItem>
            <SelectItem value='Site 1'>Site 1</SelectItem>
            <SelectItem value='Site 2'>Site 2</SelectItem>
            <SelectItem value='Site 3'>Site 3</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type='number'
          inputMode='decimal'
          placeholder='Delta > X %'
          value={(table.getColumn('delta')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('delta')?.setFilterValue(event.target.value)
          }
          className='w-full sm:w-32'
        />
        <Select
          onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Statut' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les statuts</SelectItem>
            <SelectItem value='Alerte'>Alerte</SelectItem>
            <SelectItem value='Critique'>Critique</SelectItem>
          </SelectContent>
        </Select>
        <div className='col-span-2 ml-auto flex flex-col items-end gap-2'>
          <div className='flex gap-2'>
            <Button 
              variant='outline' 
              size='sm' 
              onClick={exportCSV}
              disabled={isDownloading}
              className={downloadSuccess ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950/30' : ''}
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Export...</span>
                </div>
              ) : downloadSuccess ? (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Exporté</span>
                </div>
              ) : (
                <>
                  <IconFileTypeCsv className='mr-1 size-4' /> CSV
                </>
              )}
            </Button>
            <Button variant='outline' size='sm' onClick={exportPDF}>
              <IconFileTypePdf className='mr-1 size-4' /> PDF
            </Button>
          </div>
        </div>
      </div>

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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const delta = row.getValue<number>('delta')
                const rowClassName = Math.abs(delta) > 30
                  ? 'bg-red-50 dark:bg-red-950/20'
                  : Math.abs(delta) > 15
                    ? 'bg-orange-50 dark:bg-orange-950/20'
                    : ''

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={rowClassName}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
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
      <DataTablePagination table={table} />
      </div>
    </div>
  )
}
