'use client'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
  const flows = ['Flow A', 'Flow B', 'Flow C']
  const sites = ['Site 1', 'Site 2', 'Site 3']
  const urgencies: AlertIncident['urgency'][] = ['Info', 'Avertissement', 'Critique']
  const statuses: AlertIncident['status'][] = ['Nouveau', 'En cours', 'Résolu']
  const data: AlertIncident[] = []

  for (let i = 1; i <= 50; i++) {
    const flow = flows[Math.floor(Math.random() * flows.length)]
    const site = sites[Math.floor(Math.random() * sites.length)]
    const nb = Math.floor(Math.random() * 30) + 1
    const threshold = `> ${(Math.random() * 19 + 1).toFixed(2)} €`
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
        cell: ({ row }) =>
          new Date(row.getValue<string>('date')).toLocaleString('fr-FR'),
      },
      {
        accessorKey: 'flowType',
        header: ({ column }) => (
          <SortableColumnHeader column={column} title='Flow' />
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
            onClick={() => {
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
    count: { label: 'Incidents', color: 'hsl(var(--chart-1))' },
  }

  const exportCSV = () => {
    setIsDownloading(true)
    const headers = ['Date alerte', 'Flow', 'Site', 'Nb mismatches', 'Seuil configuré', 'Urgence', 'Statut']
    const rows = table
      .getFilteredRowModel()
      .rows.map((row: { original: AlertIncident }) => [
        new Date(row.original.date).toLocaleString('fr-FR'),
        row.original.flowType,
        row.original.site,
        row.original.nbMismatches,
        row.original.threshold,
        row.original.urgency,
        row.original.status,
      ].join(','))
    const csvContent = [headers.join(','), ...rows].join('\n')
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
    <div className='px-4 lg:px-6 pb-8'>
      <h1 className='ml-2 mt-6 text-2xl font-bold'>Alertes et incidents</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-xl'>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Incident #{selected.id}</DialogTitle>
              </DialogHeader>
              <p className='text-sm'>Flow: {selected.flowType}</p>
              <p className='text-sm'>Site: {selected.site}</p>
              <p className='text-sm'>Nb mismatches: {selected.nbMismatches}</p>
              <p className='text-sm'>Seuil: {selected.threshold}</p>
              <p className='text-sm'>Urgence: {selected.urgency}</p>
              <p className='text-sm'>Statut: {selected.status}</p>
              <a
                href='#'
                target='_blank'
                className='text-sm text-primary underline'
              >
                Ouvrir le ticket
              </a>
              <DialogFooter className='mt-4 flex flex-wrap gap-2 sm:justify-end'>
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
      <div className='flex flex-wrap items-end gap-4 py-4'>
        <Input
          placeholder='Recherche...'
          value={table.getState().globalFilter ?? ''}
          onChange={e => table.setGlobalFilter(e.target.value)}
          className='max-w-xs'
        />
        <Select
          onValueChange={value => table.getColumn('flowType')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('flowType')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Flow' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les flows</SelectItem>
            <SelectItem value='Flow A'>Flow A</SelectItem>
            <SelectItem value='Flow B'>Flow B</SelectItem>
            <SelectItem value='Flow C'>Flow C</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={value => table.getColumn('site')?.setFilterValue(value === 'all' ? '' : value)}
          value={(table.getColumn('site')?.getFilterValue() as string) ?? 'all'}
        >
          <SelectTrigger className='w-40'>
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
          <SelectTrigger className='w-40'>
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
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Statut' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous statuts</SelectItem>
            <SelectItem value='Nouveau'>Nouveau</SelectItem>
            <SelectItem value='En cours'>En cours</SelectItem>
            <SelectItem value='Résolu'>Résolu</SelectItem>
          </SelectContent>
        </Select>
        <div className='ml-auto flex flex-col items-end gap-2'>
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
      <div className='rounded-md border'>
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
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
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

      {/* Timeline Chart */}
      <h2 className='ml-2 mt-8 text-lg font-bold'>Chronologie des incidents</h2>
      <Card className='mt-4'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle className='text-sm font-medium'>Incidents sur 30 jours</CardTitle>
            <CardDescription className='text-muted-foreground'>Rolling 7j : {rolling7} incidents</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-[300px] w-full'>
            <BarChart data={timeline}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={5}
                tickFormatter={value => {
                  const date = new Date(value)
                  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                }}
              />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey='count' fill='var(--chart-1)' />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
