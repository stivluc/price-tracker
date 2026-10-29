'use client'

import { DataTablePagination } from '@/components/data-table-pagination'
import { useState, useEffect, useMemo } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IconExternalLink } from '@tabler/icons-react'
import { SortableColumnHeader } from '@/components/sortable-column-header'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconFileTypeCsv, IconFileTypePdf } from '@tabler/icons-react'
import { Card, CardBleed, CardContent, CardDescription, CardHeader, CardTitle, mobileSection } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/page-header'
import { formatDecimal, formatShortDate } from '@/lib/format'

export interface AlertIncident {
  id: number
  date: string
  flowType: string
  site: string
  nbMismatches: number
  threshold: string
  urgency: 'Info' | 'Avertissement' | 'Critique'
  status: 'Nouveau' | 'En cours' | 'Résolu'
  incidentUrl: string
  description: string
}

export interface TimelineEntry {
  date: string
  count: number
}

// Generate dummy alerts
const generateAlerts = (): AlertIncident[] => {
  const flows = ['Flux A', 'Flux B', 'Flux C']
  const sites = ['Site 1', 'Site 2', 'Site 3']
  const urgencies: AlertIncident['urgency'][] = ['Info', 'Avertissement', 'Critique']
  const statuses: AlertIncident['status'][] = ['Nouveau', 'En cours', 'Résolu']
  const data: AlertIncident[] = []

  for (let i = 1; i <= 50; i++) {
    const flow = flows[Math.floor(Math.random() * flows.length)]
    const site = sites[Math.floor(Math.random() * sites.length)]
    const nb = Math.floor(Math.random() * 30) + 1
    const threshold = `> ${formatDecimal(Math.random() * 19 + 1)} €`
    const urgency = urgencies[Math.floor(Math.random() * urgencies.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
    const incidentUrl = `https://tickets.example.com/${1000 + i}`
    const description = `${flow} sur ${site} a généré ${nb} mismatches`
    data.push({
      id: i,
      date,
      flowType: flow,
      site,
      nbMismatches: nb,
      threshold,
      urgency,
      status,
      incidentUrl,
      description,
    })
  }
  return data
}

// Incident timeline data
const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const generateTimeline = (): TimelineEntry[] => {
  const data: TimelineEntry[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    data.push({
      date: d.toISOString().slice(0, 10),
      count: Math.floor(Math.random() * 5),
    })
  }
  return data
}

// Global search filter
const globalFilter = (
  row: Row<AlertIncident>,
  columnId: string,
  value: string
) => {
  const search = String(value).toLowerCase()

  for (const key in row.original) {
    if (Object.prototype.hasOwnProperty.call(row.original, key)) {
      const cellValue = row.original[key as keyof AlertIncident];
      if (typeof cellValue === 'string' && cellValue.toLowerCase().includes(search)) {
        return true;
      }
    }
  }
  return false;
}

export default function AlertesIncidentsPage() {
  const [data, setData] = useState<AlertIncident[]>([])
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<AlertIncident | null>(null)
  const [showPdfAlert, setShowPdfAlert] = useState(false)
  const [showCorrectiveActionAlert, setShowCorrectiveActionAlert] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState('')
  const pageSize = 10

  useEffect(() => {
    setData(generateAlerts())
    setTimeline(generateTimeline())
  }, [])

  const rolling7 = timeline.slice(-7).reduce((sum, d) => sum + d.count, 0)

  const columns: ColumnDef<AlertIncident>[] = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Date alerte' />
        ),
        cell: ({ row }) => formatDateTime(row.getValue<string>('date')),
      },
      {
        accessorKey: 'flowType',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Flux' />
        ),
      },
      {
        accessorKey: 'site',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Site' />
        ),
      },
      {
        accessorKey: 'nbMismatches',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Nb mismatches' />
        ),
      },
      {
        accessorKey: 'threshold',
        header: 'Seuil configuré',
      },
      {
        accessorKey: 'urgency',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Urgence' />
        ),
        cell: ({ row }) => {
          const value = row.getValue<AlertIncident['urgency']>('urgency')
          const classes = {
            Info: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
            Avertissement:
              'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
            Critique:
              'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
          }
          return (
            <Badge variant='outline' className={classes[value]}>
              {value}
            </Badge>
          )
        },
        filterFn: (row, columnId, value) => {
          const urgency = row.getValue<AlertIncident['urgency']>(columnId)
          return value === 'all' || urgency === value
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Statut' />
        ),
        cell: ({ row }) => {
          const value = row.getValue<AlertIncident['status']>('status')
          const classes = {
            Nouveau:
              'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400',
            'En cours':
              'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
            Résolu:
              'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
          }
          return (
            <Badge variant='outline' className={classes[value]}>
              {value}
            </Badge>
          )
        },
        filterFn: (row, columnId, value) => {
          const status = row.getValue<AlertIncident['status']>(columnId)
          return value === 'all' || status === value
        },
      },
      {
        id: 'ticket',
        header: () => 'Ticket',
        cell: ({ row }) => (
          <Button
            variant='ghost'
            size='icon'
            className='hover:bg-muted/50'
            aria-label='Voir le ticket'
            onClick={(event) => {
              event.stopPropagation()
              setSelected(row.original)
              setOpen(true)
            }}
          >
            <IconExternalLink className='size-4' />
          </Button>
        ),
      },
    ],
    []
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
    onGlobalFilterChange: setSearch,
    globalFilterFn: globalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter: search,
    },
    initialState: {
      pagination: { pageSize },
    },
  })

  const chartConfig: ChartConfig = {
    count: { label: 'Incidents', color: 'var(--chart-1)' },
  }

  const exportCSV = () => {
    setIsDownloading(true)
    const headers = ['Date alerte', 'Flux', 'Site', 'Nb mismatches', 'Seuil configuré', 'Urgence', 'Statut']
    const rows = table
      .getFilteredRowModel()
      .rows.map((row: { original: AlertIncident }) => [
        formatDateTime(row.original.date),
        row.original.flowType,
        row.original.site,
        row.original.nbMismatches,
        row.original.threshold,
        row.original.urgency,
        row.original.status,
      ].join(';'))
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'alertes.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsDownloading(false)
    setDownloadSuccess(true)
    setTimeout(() => {
      setDownloadSuccess(false)
    }, 2000)
  }

  const exportPDF = () => {
    setShowPdfAlert(true)
  }

  return (
    <div className='flex flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <PageHeader title='Alertes et incidents' />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader className='text-left'>
                <DialogTitle>Incident #{selected.id}</DialogTitle>
                <DialogDescription>{formatDateTime(selected.date)}</DialogDescription>
              </DialogHeader>
              <dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm'>
                <dt className='text-muted-foreground'>Flux</dt>
                <dd>{selected.flowType}</dd>
                <dt className='text-muted-foreground'>Site</dt>
                <dd>{selected.site}</dd>
                <dt className='text-muted-foreground'>Nb mismatches</dt>
                <dd>{selected.nbMismatches}</dd>
                <dt className='text-muted-foreground'>Seuil</dt>
                <dd>{selected.threshold}</dd>
                <dt className='text-muted-foreground'>Urgence</dt>
                <dd>{selected.urgency}</dd>
                <dt className='text-muted-foreground'>Statut</dt>
                <dd>{selected.status}</dd>
              </dl>
              <DialogFooter className='gap-2'>
                <Button
                  variant='secondary'
                  onClick={() => {
                    selected.status = 'Résolu'
                    setData([...data])
                    setOpen(false)
                  }}
                >
                  Marquer comme résolu
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowCorrectiveActionAlert(true)
                    setOpen(false)
                  }}
                >
                  Action corrective
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showPdfAlert} onOpenChange={setShowPdfAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export PDF non disponible</AlertDialogTitle>
            <AlertDialogDescription>L&apos;export de rapports PDF n&apos;est pas implémenté dans cette version de démonstration.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Compris</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCorrectiveActionAlert} onOpenChange={setShowCorrectiveActionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Action corrective créée (fictif)</AlertDialogTitle>
            <AlertDialogDescription>La création d&apos;actions correctives n&apos;est pas implémentée dans cette version de démonstration.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Compris</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters Section */}
      <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end sm:gap-4'>
        <Input
          placeholder='Recherche...'
          value={table.getState().globalFilter ?? ''}
          onChange={e => table.setGlobalFilter(e.target.value)}
          className='col-span-2 sm:max-w-xs'
        />
        <Select
          onValueChange={value => table.getColumn('flowType')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('flowType')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Flux' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les flux</SelectItem>
            <SelectItem value='Flux A'>Flux A</SelectItem>
            <SelectItem value='Flux B'>Flux B</SelectItem>
            <SelectItem value='Flux C'>Flux C</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={value => table.getColumn('site')?.setFilterValue(value === 'all' ? '' : value)}
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
        <Select
          onValueChange={value => table.getColumn('urgency')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('urgency')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Urgence' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Toutes urgences</SelectItem>
            <SelectItem value='Info'>Info</SelectItem>
            <SelectItem value='Avertissement'>Avertissement</SelectItem>
            <SelectItem value='Critique'>Critique</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={value => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Statut' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous statuts</SelectItem>
            <SelectItem value='Nouveau'>Nouveau</SelectItem>
            <SelectItem value='En cours'>En cours</SelectItem>
            <SelectItem value='Résolu'>Résolu</SelectItem>
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

      {/* Alerts Table */}
      <div className={cn(mobileSection, 'max-sm:pt-0')}>
      <div className="-mx-4 border-y sm:mx-0 sm:rounded-md sm:border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
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
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} onClick={() => {
                  setSelected(row.original)
                  setOpen(true)
                }} className='cursor-pointer'>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='py-2'>
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
      <DataTablePagination table={table} />
      </div>

      {/* Timeline Chart */}
      <Card bleed>
        <CardHeader>
          <CardTitle>Chronologie des incidents</CardTitle>
          <CardDescription>
            30 derniers jours, dont {rolling7} sur les 7 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardBleed>
            <ChartContainer config={chartConfig} className='aspect-auto h-[200px] w-full sm:h-[260px]'>
              <BarChart data={timeline} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={formatShortDate}
                />
                <YAxis
                  width={28}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelFormatter={(value) => formatShortDate(value)} />}
                />
                <Bar dataKey='count' fill='var(--color-count)' radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardBleed>
        </CardContent>
      </Card>
    </div>
  )
}
