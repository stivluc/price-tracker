import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NumberFlow from "@number-flow/react"
import { useEffect, useState, useRef } from "react"

export function StatsCards() {
  const [totalLines, setTotalLines] = useState(2625103)
  const [globalConcordance, setGlobalConcordance] = useState(96.4)
  const [totalDivergences, setTotalDivergences] = useState(45678)
  const [avgAbsoluteDelta, setAvgAbsoluteDelta] = useState(4.5)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTotalLines(prev => prev + Math.floor(Math.random() * 500) + 100) // Always increase

      setGlobalConcordance(prev => {
        const change = (Math.random() * 0.4 - 0.2) // +/- 0.2%
        let newValue = prev + change
        if (newValue > 99.9) newValue = 99.9
        if (newValue < 90) newValue = 90 // Keep it within a reasonable range
        return parseFloat(newValue.toFixed(1))
      })

      setTotalDivergences(prev => prev + Math.floor(Math.random() * 500) - 250) // Fluctuate

      setAvgAbsoluteDelta(prev => {
        const change = (Math.random() * 0.1) // 0 to 0.1
        let newValue = prev + change
        if (newValue > 10) newValue = 10
        if (newValue < 1) newValue = 1
        return parseFloat(newValue.toFixed(1))
      })
    }, 5000) // Update every 5 seconds (5000ms)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total lignes traitées</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberFlow value={totalLines} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tend à augmenter <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Lignes traitées par jour
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Concordance globale</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberFlow value={globalConcordance} />%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -1,2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            En baisse sur la période<IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Flow A nécessite une attention particulière
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de divergences</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberFlow value={totalDivergences} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Augmentation significative<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Flow C vers Site 2 a le plus de divergences</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Delta moyen absolu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberFlow value={avgAbsoluteDelta} />%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0,3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Augmentation le mois dernier<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Le plus grand delta est de 48,5%</div>
        </CardFooter>
      </Card>
    </div>
  )
}
