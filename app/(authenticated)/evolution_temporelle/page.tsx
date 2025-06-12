'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
import ForecastChart from '@/components/forecast-chart'

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
  const flows = ['Flux A', 'Flux B', 'Flux C', 'Flux D', 'Flux E', 'Flux F', 'Flux G', 'Flux H'];
  const startDate = new Date('2023-08-01');

  // Initialize base values for each flow
  const baseValues = flows.reduce((acc, flow) => {
    acc[flow] = Math.floor(Math.random() * 50) + 50; // Start between 50 and 100
    return acc;
  }, {} as Record<string, number>);

  // Initialize previous values for smoothing
  const prevValues = { ...baseValues };

  for (let i = 0; i < 120; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().slice(0, 10);

    const entry: MismatchData = { date: dateString };
    flows.forEach(flow => {
      // Generate a small random change (-5 to +5)
      const change = (Math.random() - 0.5) * 10;
      
      // Apply smoothing: new value is 80% previous + 20% new target
      const targetValue = prevValues[flow] + change;
      const newValue = Math.round(prevValues[flow] * 0.8 + targetValue * 0.2);
      
      // Ensure value stays within reasonable bounds (30 to 150)
      entry[flow] = Math.max(30, Math.min(150, newValue));
      
      // Update previous value for next iteration
      prevValues[flow] = entry[flow];
    });
    data.push(entry);
  }
  return data;
};

const generateComplianceData = (): ComplianceData[] => {
  const data: ComplianceData[] = [];
  const startDate = new Date('2023-08-01');
  let currentCompliance = 85; // Start at 85%

  for (let i = 0; i < 120; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().slice(0, 10);

    // Simulate more pronounced variations
    const change = (Math.random() - 0.5) * 2; // Increased variation range
    currentCompliance = Math.max(75, Math.min(95, currentCompliance + change));

    // Add occasional larger variations (every ~20 days)
    if (i % 20 === 0) {
      const largeChange = (Math.random() - 0.5) * 5;
      currentCompliance = Math.max(75, Math.min(95, currentCompliance + largeChange));
    }

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

export default function EvolutionTemporellePage() {
  const [mismatchData, setMismatchData] = React.useState<MismatchData[]>([]);
  const [complianceData, setComplianceData] = React.useState<ComplianceData[]>([]);
  const [timeRange, setTimeRange] = React.useState('30d');
  const allFlows = React.useMemo(() => Object.keys(allMismatchData[0] || {}).filter(key => key !== 'date'), []);
  const [selectedFlows, setSelectedFlows] = React.useState<string[]>(allFlows.slice(0, 3));

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

  }, [timeRange, selectedFlows, allFlows]);

  // Dynamically generate mismatch chart config based on selected flows
  const mismatchChartConfig = React.useMemo(() => {
    return selectedFlows.reduce((config, flowType, index) => {
      config[flowType] = {
        label: flowType,
        color: `var(--chart-${index + 1})`,
      };
      return config;
    }, {} as ChartConfig);
  }, [selectedFlows]);

  // Prepare items for MultiSelect
  const flowMultiSelectItems = React.useMemo(() => {
    return allFlows.map(flow => ({ label: flow, value: flow }));
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
              selected={selectedFlows.slice(0,5)}
              onSelectedChange={(newSelected) => setSelectedFlows(newSelected.slice(0,5))}
              placeholder="Sélectionner les flux"
              searchPlaceholder="Rechercher un flux..."
              emptyText="Aucun flux trouvé."
              labelKey="label"
              valueKey="value"
              className="w-[200px]"
              maxSelections={5}
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
            <BarChart data={mismatchData}>
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
                <Bar
                  key={flowType}
                  dataKey={flowType}
                  fill={`var(--chart-${index + 1})`}
                  stackId="a"
                />
              ))}
              <ChartLegend 
                content={({ payload }) => (
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {payload?.map((entry) => {
                      const flowType = entry.value as string;
                      const config = mismatchChartConfig[flowType];
                      return (
                        <div key={flowType} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: `var(--chart-${selectedFlows.indexOf(flowType) + 1})` }}
                          />
                          <span className="text-sm">{config?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Compliance Rate Chart: Rolling 7-day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taux de conformité rolling 7 jours</CardTitle>
            <CardDescription className="text-muted-foreground">Évolution du taux de conformité sur les 7 derniers jours.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ChartContainer config={complianceChartConfig} className="h-full w-full">
              <AreaChart data={complianceData}>
                <defs>
                  <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  </linearGradient>
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
                <YAxis 
                  domain={[70, 100]} 
                  label={{ value: 'Taux (%)', angle: -90, position: 'insideLeft' }} 
                  tickCount={7}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="complianceRate"
                  fill="url(#complianceGradient)"
                  stroke="var(--chart-1)"
                  dot={false}
                  activeDot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Forecasting Area */}
        <ForecastChart />
      </div>
    </div>
  );
}
