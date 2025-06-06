'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface FlowStats {
  flow: string
  total: number
  matched: number
  mismatch: number
  deltaMean: number
  deltaMax: number
}

const initialData: FlowStats[] = [
  { flow: 'Flow A', total: 11250, matched: 10800, mismatch: 450, deltaMean: 2.1, deltaMax: 7.5 },
  { flow: 'Flow B', total: 9850, matched: 9100, mismatch: 750, deltaMean: 3.8, deltaMax: 12.3 },
  { flow: 'Flow C', total: 15600, matched: 15050, mismatch: 550, deltaMean: 1.9, deltaMax: 9.6 },
  { flow: 'Flow D', total: 7450, matched: 6900, mismatch: 550, deltaMean: 4.3, deltaMax: 15.1 },
  { flow: 'Flow E', total: 6340, matched: 6200, mismatch: 140, deltaMean: 1.2, deltaMax: 5.8 },
]

function getComment(mismatchPct: number) {
  if (mismatchPct < 5) {
    return {
      icon: CheckCircle,
      text: 'Flux stable',
      className: 'text-green-600 dark:text-green-400',
    }
  }
  if (mismatchPct < 15) {
    return {
      icon: AlertTriangle,
      text: 'Quelques anomalies détectées',
      className: 'text-orange-600 dark:text-orange-400',
    }
  }
  return {
    icon: AlertCircle,
    text: 'Flux critique',
    className: 'text-red-600 dark:text-red-400',
  }
}

export default function DetailFluxPage() {
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<'mismatchPct' | 'deltaMax'>('mismatchPct')
  const [desc, setDesc] = useState(true)

  const tableData = useMemo(() => {
    return initialData
      .filter((row) =>
        row.flow.toLowerCase().includes(filter.toLowerCase()),
      )
      .map((row) => ({
        ...row,
        mismatchPct: (row.mismatch / row.total) * 100,
      }))
      .sort((a, b) => {
        const delta = a[sortKey] - b[sortKey]
        return desc ? -delta : delta
      })
  }, [filter, sortKey, desc])

  function handleSort(key: 'mismatchPct' | 'deltaMax') {
    if (sortKey === key) {
      setDesc(!desc)
    } else {
      setSortKey(key)
      setDesc(true)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="ml-8 text-2xl font-bold">Détail par flux</h1>
          <div className="px-4 lg:px-6">
            <Input
              placeholder="Filtrer par flux"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flux</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Matched</TableHead>
                  <TableHead className="text-right">Mismatch</TableHead>
                  <TableHead
                    onClick={() => handleSort('mismatchPct')}
                    className="cursor-pointer text-right"
                  >
                    % Mismatch
                  </TableHead>
                  <TableHead className="text-right">Delta moyen</TableHead>
                  <TableHead
                    onClick={() => handleSort('deltaMax')}
                    className="cursor-pointer text-right"
                  >
                    Delta max
                  </TableHead>
                  <TableHead>Commentaire</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => {
                  const comment = getComment(row.mismatchPct)
                  const Icon = comment.icon
                  return (
                    <TableRow key={row.flow}>
                      <TableCell>{row.flow}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.matched.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.mismatch.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.mismatchPct.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.deltaMean.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.deltaMax.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Icon className={`size-5 ${comment.className}`} />
                          </TooltipTrigger>
                          <TooltipContent>{comment.text}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

