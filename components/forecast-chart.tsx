'use client'

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// --- Data Generation Functions ---
const generateRealData = (days: number = 30): { date: string; mismatches: number }[] => {
  const data: { date: string; mismatches: number }[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(now.getTime() - (days - 1 - i) * 24 * 3600 * 1000);
    data.push({
      date: currentDate.toISOString().slice(0, 10),
      mismatches: Math.round(20 + 10 * Math.sin(i / 5) + Math.random() * 5),
    });
  }
  return data;
};

const generateForecastData = (lastRealMismatches: number, realData: { date: string; mismatches: number }[], days: number = 7): { date: string; mismatches: number; upper: number; lower: number }[] => {
  const data: { date: string; mismatches: number; upper: number; lower: number }[] = [];
  const now = new Date();
  const recentTrendPeriod = 10; // Use last 10 days to calculate trend
  const startIndex = Math.max(0, realData.length - recentTrendPeriod);
  const relevantRealData = realData.slice(startIndex);

  let slope = 0;
  if (relevantRealData.length > 1) {
    const firstMismatch = relevantRealData[0].mismatches;
    const lastMismatch = relevantRealData[relevantRealData.length - 1].mismatches;
    slope = (lastMismatch - firstMismatch) / (relevantRealData.length - 1);
  }

  // --- New logic to encourage progressive threshold crossing ---
  // If the last real data point is somewhat close to or above the threshold
  if (lastRealMismatches >= alertThreshold * 0.75) { 
    // Ensure a gentle positive slope if it's not already strong enough
    if (slope < 0.5) { // If current slope is flat or slightly negative/positive
      slope = 0.5 + (Math.random() * 0.5); // Force a gentle positive slope (0.5 to 1)
    }
  } else if (lastRealMismatches >= alertThreshold * 0.60 && lastRealMismatches < alertThreshold * 0.75) {
      // If data is in mid-range, sometimes nudge towards a crossing with a smaller slope
      if (Math.random() < 0.7) { // 70% chance to nudge
         if (slope < 0.2) { // If current slope is very flat or negative
            slope = 0.2 + (Math.random() * 0.3); // Force a very gentle positive slope (0.2 to 0.5)
         }
      }
  }
  // --- End new logic ---

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(now.getTime() + (i + 1) * 24 * 3600 * 1000); // Start from next day
    let forecastedMismatch = lastRealMismatches + (i + 1) * slope + (Math.random() - 0.5) * 2; // Reduced random fluctuation

    // Ensure forecasted mismatches are within a reasonable range
    forecastedMismatch = Math.max(10, Math.min(100, forecastedMismatch));

    const confidencePercentage = 0.10; // ± 10%
    const confidenceValue = forecastedMismatch * confidencePercentage;

    data.push({
      date: currentDate.toISOString().slice(0, 10),
      mismatches: Math.round(forecastedMismatch),
      upper: Math.round(forecastedMismatch + confidenceValue),
      lower: Math.round(forecastedMismatch - confidenceValue),
    });
  }

  return data;
};

const alertThreshold = 50;

// --- KPI Calculation Functions ---
const calculateSlope = (data: { date: string; mismatches: number }[], days: number = 7): string => {
  if (data.length < days) return 'N/A';
  const recentData = data.slice(-days);
  const firstMismatch = recentData[0].mismatches;
  const lastMismatch = recentData[recentData.length - 1].mismatches;
  const slopeValue = (lastMismatch - firstMismatch) / (days - 1);
  return `${slopeValue > 0 ? '+' : ''}${slopeValue.toFixed(2)} mismatches/jour`;
};

const estimateThresholdCrossingDate = (forecastData: { date: string; mismatches: number }[], threshold: number): string => {
  for (const item of forecastData) {
    if (item.mismatches >= threshold) {
      return new Date(item.date).toLocaleDateString('fr-FR');
    }
  }
  return 'Non prévu';
};

// --- ForecastChart Component ---
const ForecastChart: React.FC = () => {
  const [realData, setRealData] = useState<{ date: string; mismatches: number }[]>([]);
  const [forecastData, setForecastData] = useState<{ date: string; mismatches: number; upper: number; lower: number }[]>([]);
  const [allDates, setAllDates] = useState<string[]>([]);
  const [slope, setSlope] = useState<string>('');
  const [thresholdDate, setThresholdDate] = useState<string>('Non prévu');

  useEffect(() => {
    const real = generateRealData();
    const lastRealMismatch = real[real.length - 1]?.mismatches || 0;
    const forecast = generateForecastData(lastRealMismatch, real);

    setRealData(real);
    setForecastData(forecast);
    setAllDates([...real.map(d => d.date), ...forecast.map(d => d.date)]);

    const calculatedSlope = calculateSlope(real);
    setSlope(calculatedSlope);

    const estimatedDate = estimateThresholdCrossingDate(forecast, alertThreshold);
    setThresholdDate(estimatedDate);
  }, []);

  const getOption = () => ({
    xAxis: {
      type: 'category',
      data: allDates,
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value);
          return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        },
        interval: 3 // Adjust interval to prevent overcrowding
      },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    yAxis: {
      type: 'value',
      name: 'Mismatches',
      axisLabel: {
        formatter: '{value}'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: 30, // Adjusted top to give space for title/description in pixels
      bottom: 30, // Increased bottom for legend and KPIs in pixels
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: Array<{ name: string; value: number; seriesName: string }>) => {
        const date = params[0].name;
        let tooltipContent = `Date: ${date}<br/>`;
        params.forEach(param => {
          if (param.seriesName === 'Réel' || param.seriesName === 'Forecast') {
            tooltipContent += `${param.seriesName}: ${param.value} mismatches<br/>`;
            if (param.seriesName === 'Forecast' && param.value >= alertThreshold) {
              tooltipContent += `<span style="color:red;">⚠️ Seuil d'alerte franchi !</span><br/>`;
            }
          }
        });
        return tooltipContent;
      }
    },
    legend: {
      data: ['Réel', 'Forecast', 'Seuil Alerte'],
      selectedMode: false,
      top: 'bottom', // Place legend at the bottom of the chart container
      left: 'center', // Center the legend
    },
    series: [
      {
        name: 'Réel',
        data: realData.map(d => d.mismatches),
        type: 'line',
        smooth: true,
        lineStyle: { width: 2, color: 'hsl(var(--chart-1))' }, // Using chart-1 for real data
        z: 3 // Higher z-index to be on top
      },
      {
        name: 'Forecast Lower',
        data: [...realData.map(() => null), ...forecastData.map(d => d.lower)],
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: 'rgba(255, 165, 0, 0.1)' // Light orange transparent fill for confidence band
        },
        z: 1 // Lower z-index
      },
      {
        name: 'Forecast Upper',
        data: [...realData.map(() => null), ...forecastData.map(d => d.upper)],
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: 'rgba(255, 165, 0, 0.1)' // Light orange transparent fill for confidence band
        },
        z: 1 // Lower z-index
      },
      {
        name: 'Forecast',
        data: [...realData.map(() => null), ...forecastData.map(d => d.mismatches)],
        type: 'line',
        smooth: true,
        lineStyle: { type: 'dashed', width: 2, color: 'hsl(var(--chart-2))' }, // Using chart-2 for forecast
        symbol: (value: number, params: { data: [string, number, number, number] }) => {
          if (params.data && params.data[1] && params.data[1] >= alertThreshold) {
            return 'path://M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z'; // Exclamation icon SVG path
          }
          return 'none';
        },
        symbolSize: 20,
        itemStyle: {
          color: 'red'
        },
        z: 2 // Middle z-index
      },
      {
        name: 'Seuil Alerte',
        data: Array(realData.length + forecastData.length).fill(alertThreshold),
        type: 'line',
        lineStyle: { color: 'red', width: 1, type: 'dotted' },
        z: 0 // Lowest z-index
      }
    ]
  });

  return (
    <Card className="h-full flex flex-col"> {/* Added h-full flex flex-col to make card stretch */}
      <CardHeader className="text-sm font-medium">
          <CardTitle className="text-sm font-medium">Zone de prévision</CardTitle>
          <CardDescription className="text-muted-foreground">Analyse des tendances futures et détection des dérives potentielles.</CardDescription> {/* Re-added description */}
        {/* KPIs moved below chart */}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col"> {/* Removed justify-between */}
        <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} /> {/* Changed height to 100% */}
        <div className="flex flex-col text-left text-sm text-muted-foreground mt-4">
          <p>Slope 7j : {slope}</p>
          <p>Seuil prévu franchi le : {thresholdDate}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastChart; 