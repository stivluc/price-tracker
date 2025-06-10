'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

// Define types for chart data
type MismatchData = {
  date: string;
  [flowType: string]: number | string; // e.g., '2023-01-01': 120, 'Flow A': 50, 'Flow B': 70
};

type ComplianceData = {
  date: string;
  complianceRate: number;
};

// Generate dummy data (replace with actual data fetching later)
const generateMismatchData = (): MismatchData[] => {
  const data: MismatchData[] = [];
  const flows = ['Flow A', 'Flow B', 'Flow C', 'Flow D', 'Flow E', 'Flow F', 'Flow G', 'Flow H'];
  const startDate = new Date('2023-08-01');

  for (let i = 0; i < 120; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().slice(0, 10);

    const entry: MismatchData = { date: dateString };
    flows.forEach(flow => {
      entry[flow] = Math.floor(Math.random() * 200);
    });
    data.push(entry);
  }
  return data;
};

const generateComplianceData = (): ComplianceData[] => {
  const data: ComplianceData[] = [];
  const startDate = new Date('2023-08-01');
  let currentCompliance = 80;

  for (let i = 0; i < 120; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().slice(0, 10);

    // Simulate rolling compliance change with smaller variations
    const change = (Math.random() - 0.5) * 0.5;
    currentCompliance = Math.max(75, Math.min(90, currentCompliance + change));

    data.push({
      date: dateString,
      complianceRate: +currentCompliance.toFixed(2),
    });
  }
  return data;
};

const allMismatchData = generateMismatchData();
const allComplianceData = generateComplianceData();

const complianceChartConfig = {
  complianceRate: {
    label: 'Taux de conformité',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

// A more extensive color palette for flows
// const flowColors = [
//   'hsl(var(--chart-1))',
//   'hsl(var(--chart-2))',
//   'hsl(var(--chart-3))',
//   'hsl(var(--chart-4))',
//   'hsl(var(--chart-5))',
//   'hsl(var(--chart-6))',
//   'hsl(var(--chart-7))',
//   'hsl(var(--chart-8))',
//   'hsl(var(--chart-9))',
//   'hsl(var(--chart-10))',
// ];

export default function EvolutionTemporellePage() {
  const [mismatchData, setMismatchData] = React.useState<MismatchData[]>([]);
  const [complianceData, setComplianceData] = React.useState<ComplianceData[]>([]);
  const [timeRange, setTimeRange] = React.useState('90d');
  const allFlows = React.useMemo(() => Object.keys(allMismatchData[0] || {}).filter(key => key !== 'date'), []);
  const [selectedFlows, setSelectedFlows] = React.useState<string[]>(allFlows);

  React.useEffect(() => {
    // Filter data based on time range
    const endDate = new Date('2023-11-28');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - daysToSubtract);

    const filteredMismatch = allMismatchData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    const filteredCompliance = allComplianceData.filter(item => {
       const itemDate = new Date(item.date);
       return itemDate >= startDate && itemDate <= endDate;
    });

    // Filter flows within the data points based on selectedFlows state
    const processedMismatchData = filteredMismatch.map(item => {
      const newItem: MismatchData = { date: item.date };
      selectedFlows.forEach(flow => {
        if (item[flow] !== undefined) {
          newItem[flow] = item[flow];
        }
      });
      return newItem;
    });

    setMismatchData(processedMismatchData);
    setComplianceData(filteredCompliance);

  }, [timeRange, selectedFlows, allFlows]); // Add allFlows to dependency array

  // Dynamically generate mismatch chart config based on selected flows and colors
  const mismatchChartConfig = React.useMemo(() => {
    return selectedFlows.reduce((config, flowType, index) => {
      config[flowType] = {
        label: flowType.replace('Flow', 'Flux '),
        color: `var(--color-chart-${(index % 10) + 1})`, // Directly use var(--color-chart-X)
      };
      return config;
    }, {} as ChartConfig);
  }, [selectedFlows]);

  // Prepare items for MultiSelect
  const flowMultiSelectItems = React.useMemo(() => {
    return allFlows.map(flow => ({ label: flow.replace('Flow', 'Flux '), value: flow }));
  }, [allFlows]);

  return (
    <div className='flex flex-col gap-4 px-4 py-4 lg:px-6'>
      <h1 className='ml-2 mt-2 text-2xl font-bold'>Évolution temporelle</h1>

      {/* Time Series Chart: Mismatches per day per flow */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de mismatches par jour et par flux</CardTitle>
          <div className="flex items-center gap-4">
            <MultiSelect
              items={flowMultiSelectItems}
              selected={selectedFlows}
              onSelectedChange={setSelectedFlows}
              placeholder="Sélectionner les flux"
              searchPlaceholder="Rechercher un flux..."
              emptyText="Aucun flux trouvé."
              labelKey="label"
              valueKey="value"
              className="w-[200px]"
            />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sélectionner période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Derniers 7 jours</SelectItem>
                <SelectItem value="30d">Derniers 30 jours</SelectItem>
                <SelectItem value="90d">Derniers 90 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFlows.map((value) => {
              const item = flowMultiSelectItems.find(item => item.value === value);
              return item ? (
                <Badge
                  key={value}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {item.label}
                  <button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setSelectedFlows(selectedFlows.filter((item) => item !== value));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
          <ChartContainer config={mismatchChartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart data={mismatchData}>
              <defs>
                {selectedFlows.map((flowType, index) => (
                  <linearGradient
                    key={flowType}
                    id={`fill${flowType}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={mismatchChartConfig[flowType]?.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={mismatchChartConfig[flowType]?.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={timeRange === '90d' ? 14 : timeRange === '30d' ? 5 : 1}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                }}
              />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {selectedFlows.map((flowType, index) => (
                <Area
                  key={flowType}
                  type='monotone'
                  dataKey={flowType}
                  fill={`url(#fill${flowType})`}
                  stroke={mismatchChartConfig[flowType]?.color}
                  stackId="1"
                  dot={false}
                  activeDot={false}
                />
              ))}
              <ChartLegend 
                content={({ payload }) => (
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {payload?.map((entry, index) => {
                      const flowType = entry.value as string;
                      const config = mismatchChartConfig[flowType];
                      return (
                        <div key={flowType} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: config?.color }}
                          />
                          <span className="text-sm">{config?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Compliance Rate Chart: Rolling 7-day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taux de conformité rolling 7 jours</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={complianceChartConfig} className="aspect-auto h-[300px] w-full">
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray='3 3' />
                 <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                  }}
                />
                <YAxis domain={[0, 100]} label={{ value: 'Taux (%)', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  type='monotone'
                  dataKey='complianceRate'
                  stroke={complianceChartConfig.complianceRate.color}
                  dot={false}
                  activeDot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Forecasting Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Prévisions et Alertes précoces</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analyse des tendances pour identifier les dérives potentielles et générer des alertes précoces.</p>
            {/* Future implementation: display forecasting chart or list of alerts here */}
            <div className="mt-4 p-4 border rounded-md">
                <h3 className="text-lg font-semibold">Alertes Actives:</h3>
                <ul className="list-disc pl-5">
                    <li>[Date] - Dérive détectée sur Flux A (ex: baisse du taux de conformité)</li>
                    <li>[Date] - Pic anormal de mismatches sur Site B</li>
                    {/* Add more dummy alerts or fetch actual alerts */}
                </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
