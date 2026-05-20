"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";
import "./DonationTrackerGraph.css";
import { Item } from "api/item";

type Timeframe = "7d" | "30d" | "quarter" | "ytd" | "1y";

type ClusterBy = "day" | "2d" | "week" | "2w" | "month";

type DataPoint = {
  date: string;
  value: number;
};

type ClusterOption = {
  value: ClusterBy;
  label: string;
  days: number;
};

const clusterOptions: ClusterOption[] = [
  { value: "day", label: "Day", days: 1 },
  { value: "2d", label: "2 Days", days: 2 },
  { value: "week", label: "Week", days: 7 },
  { value: "2w", label: "2 Weeks", days: 14 },
  { value: "month", label: "Month", days: 30 },
];

function getISODateDaysAgo(daysAgo: number): string {
  const now = new Date();

  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysAgo,
  );

  return date.toISOString().substring(0, 10);
}

function getDayOfYear(): number {
  const now = new Date();

  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const diff = now.getTime() - startOfYear.getTime();

  return Math.floor(diff / 86400000) + 1;
}

// Determine how much data to show.
function getTotalDays(timeframe: Timeframe): number {
  switch (timeframe) {
    case "7d":
      return 7;

    case "30d":
      return 30;

    case "quarter":
      return 90;

    case "ytd":
      return getDayOfYear();

    case "1y":
      return 365;
  }
}

// Only show grouping options that make sense.
function getAllowedClusters(timeframe: Timeframe): ClusterOption[] {
  switch (timeframe) {
    case "7d":
      return clusterOptions.filter((option) =>
        ["day", "2d"].includes(option.value),
      );

    case "30d":
      return clusterOptions.filter((option) =>
        ["day", "2d", "week", "2w"].includes(option.value),
      );

    case "quarter":
      return clusterOptions;

    case "ytd":
    case "1y":
      return clusterOptions.filter((option) =>
        ["week", "2w", "month"].includes(option.value),
      );
  }
}

function getClusterDays(clusterBy: ClusterBy): number {
  return clusterOptions.find((option) => option.value === clusterBy)?.days ?? 1;
}

// Adjust x-axis formatting based on timeframe.
function getDateFormat(timeframe: Timeframe, clusterBy: ClusterBy): string {
  if (timeframe === "7d") return "EEE";

  if (clusterBy === "month") return "MMM";

  return "M/d";
}

// Get only the data needed for the selected timeframe.
function getTimeframeData(
  fullData: DataPoint[],
  timeframe: Timeframe,
): DataPoint[] {
  const totalDays = getTotalDays(timeframe);

  return fullData.slice(-totalDays);
}

// Combine nearby data points into grouped totals.
function clusterData(data: DataPoint[], clusterDays: number): DataPoint[] {
  if (clusterDays === 1) return data;

  const clusteredData: DataPoint[] = [];

  for (let index = 0; index < data.length; index += clusterDays) {
    const group = data.slice(index, index + clusterDays);

    const total = group.reduce((sum, point) => sum + point.value, 0);

    clusteredData.push({
      date: group[0].date,
      value: total,
    });
  }

  return clusteredData;
}

// Round axis max to a clean multiple of 5.
function roundUpToNearestFive(value: number): number {
  return Math.max(5, Math.ceil(value / 5) * 5);
}

function getYAxisMax(data: DataPoint[]): number {
  const highestValue = Math.max(...data.map((point) => point.value));

  return roundUpToNearestFive(highestValue);
}

// Create evenly spaced y-axis labels.
function getYAxisTicks(yAxisMax: number): number[] {
  const step = yAxisMax / 5;

  return [0, step, step * 2, step * 3, step * 4, yAxisMax];
}

type ToolProps = {
  active?: boolean;

  payload?: {
    value: number;
  }[];

  label?: string;
};

function CustomToolTip({ active, payload, label }: ToolProps) {
  if (!active || !payload?.length || !label) {
    return null;
  }

  return (
    <div className="tooltip">
      <h4>{format(parseISO(label), "eeee, MMM d")}</h4>

      <p>Donations Received: {payload[0].value}</p>
    </div>
  );
}

function ResponsiveGraph({
  data,
  timeframe,
  clusterBy,
}: {
  data: DataPoint[];

  timeframe: Timeframe;

  clusterBy: ClusterBy;
}) {
  const dateFormat = getDateFormat(timeframe, clusterBy);

  const yAxisMax = getYAxisMax(data);

  const yAxisTicks = getYAxisTicks(yAxisMax);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 24,
          left: 0,
          bottom: 24,
        }}
      >
        <defs>
          <linearGradient id="donationColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4379ee" stopOpacity={0.35} />

            <stop offset="75%" stopColor="#4379ee" stopOpacity={0.03} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#e5e7eb" vertical={false} />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickMargin={16}
          tick={{
            fill: "#9ca3af",
            fontSize: 14,
          }}
          tickFormatter={(str) => format(parseISO(str), dateFormat)}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          domain={[0, yAxisMax]}
          ticks={yAxisTicks}
          tick={{
            fill: "#9ca3af",
            fontSize: 14,
          }}
          tickFormatter={(value) => Math.round(value).toString()}
        />

        <Tooltip content={<CustomToolTip />} />

        <Area
          type="linear"
          dataKey="value"
          stroke="#4379ee"
          fill="url(#donationColor)"
          strokeWidth={2.5}
          dot={{
            r: 4,
            fill: "#4379ee",
          }}
          activeDot={{
            r: 5,
            fill: "#4379ee",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DonationTrackerGraphProps {
  items: Item[];
}

export default function DonationTrackerGraph({
  items,
}: DonationTrackerGraphProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");

  const [clusterBy, setClusterBy] = useState<ClusterBy>("day");

  // Create sample data once.
  const fullYearSampleData = useMemo(() => {
    const countByDate: Record<string, number> = {};
    items.forEach((item) => {
      const date = new Date(item.timeSubmitted).toISOString().substring(0, 10);
      countByDate[date] = (countByDate[date] || 0) + 1;
    });

    return Array.from({ length: 365 }, (_, i) => ({
      date: getISODateDaysAgo(364 - i),
      value: countByDate[getISODateDaysAgo(364 - i)] ?? 0,
    }));
  }, [items]);

  const allowedClusters = useMemo(
    () => getAllowedClusters(timeframe),
    [timeframe],
  );

  // Reset grouping if current option becomes invalid.
  useEffect(() => {
    const isAllowed = allowedClusters.some(
      (option) => option.value === clusterBy,
    );

    if (!isAllowed) {
      setClusterBy(allowedClusters[0].value);
    }
  }, [timeframe, clusterBy, allowedClusters]);

  // Build the displayed chart data.
  const chartData = useMemo(() => {
    const timeframeData = getTimeframeData(fullYearSampleData, timeframe);

    const clusterDays = getClusterDays(clusterBy);

    return clusterData(timeframeData, clusterDays);
  }, [fullYearSampleData, timeframe, clusterBy]);

  return (
    <div className="chart-card">
      <div className="graph-header">
        <h2>Donation Tracker</h2>

        <div className="dropdowns-section">
          <select
            className="filter-select"
            value={clusterBy}
            onChange={(event) => setClusterBy(event.target.value as ClusterBy)}
          >
            {allowedClusters.map((option) => (
              <option key={option.value} value={option.value}>
                Group by {option.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={timeframe}
            onChange={(event) => setTimeframe(event.target.value as Timeframe)}
          >
            <option value="7d">Last 7 Days</option>

            <option value="30d">Last 30 Days</option>

            <option value="quarter">This Quarter</option>

            <option value="ytd">Year to Date</option>

            <option value="1y">Last 12 Months</option>
          </select>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveGraph
          data={chartData}
          timeframe={timeframe}
          clusterBy={clusterBy}
        />
      </div>
    </div>
  );
}
