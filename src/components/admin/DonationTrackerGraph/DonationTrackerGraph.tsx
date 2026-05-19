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

const fullYearSampleData: DataPoint[] = createFullYearSampleData();

function createFullYearSampleData(): DataPoint[] {
  const chartData: DataPoint[] = [];

  for (let num = 364; num >= 0; num--) {
    chartData.push({
      date: getISODateDaysAgo(num),
      value: Math.floor(Math.random() * 50),
    });
  }

  return chartData;
}

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

function getAllowedClusters(timeframe: Timeframe): ClusterOption[] {
  switch (timeframe) {
    case "7d":
      return clusterOptions.filter((option) =>
        ["day", "2d"].includes(option.value)
      );

    case "30d":
      return clusterOptions.filter((option) =>
        ["day", "2d", "week", "2w"].includes(option.value)
      );

    case "quarter":
      return clusterOptions.filter((option) =>
        ["day", "2d", "week", "2w", "month"].includes(option.value)
      );

    case "ytd":
    case "1y":
      return clusterOptions.filter((option) =>
        ["week", "2w", "month"].includes(option.value)
      );
  }
}

function getClusterDays(clusterBy: ClusterBy): number {
  return clusterOptions.find((option) => option.value === clusterBy)?.days ?? 1;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();

  return Math.floor(diff / 86400000);
}

function getDateFormat(timeframe: Timeframe, clusterBy: ClusterBy): string {
  if (timeframe === "7d") {
    return "EEE";
  }

  if (clusterBy === "month") {
    return "MMM";
  }

  return "M/d";
}

function getISODateDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString().substring(0, 10);
}

function getTimeframeData(timeframe: Timeframe): DataPoint[] {
  const totalDays = getTotalDays(timeframe);

  return fullYearSampleData.slice(-totalDays);
}

function clusterData(data: DataPoint[], clusterDays: number): DataPoint[] {
  if (clusterDays === 1) {
    return data;
  }

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

function roundUpToNearestFive(value: number): number {
  if (value <= 0) {
    return 5;
  }

  return Math.ceil(value / 5) * 5;
}

function getYAxisMax(data: DataPoint[]): number {
  const highestValue = Math.max(...data.map((point) => point.value));

  return roundUpToNearestFive(highestValue);
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
  timeframe,
  clusterBy,
}: {
  timeframe: Timeframe;
  clusterBy: ClusterBy;
}) {
  const clusterDays = getClusterDays(clusterBy);
  const dateFormat = getDateFormat(timeframe, clusterBy);

  const data = useMemo(() => {
    const timeframeData = getTimeframeData(timeframe);
    return clusterData(timeframeData, clusterDays);
  }, [timeframe, clusterDays]);

  const yAxisMax = useMemo(() => getYAxisMax(data), [data]);

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
          tick={{ fill: "#9ca3af", fontSize: 14 }}
          tickFormatter={(str) => format(parseISO(str), dateFormat)}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tickCount={6}
          domain={[0, yAxisMax]}
          ticks={[
            0,
            yAxisMax * 0.2,
            yAxisMax * 0.4,
            yAxisMax * 0.6,
            yAxisMax * 0.8,
            yAxisMax,
          ]}
          tick={{ fill: "#9ca3af", fontSize: 14 }}
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
            fillOpacity: 1,
          }}
          activeDot={{
            r: 5,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function DonationTrackerGraph() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");
  const [clusterBy, setClusterBy] = useState<ClusterBy>("day");

  const allowedClusters = getAllowedClusters(timeframe);

  useEffect(() => {
    const isCurrentClusterAllowed = allowedClusters.some(
      (option) => option.value === clusterBy
    );

    if (!isCurrentClusterAllowed) {
      setClusterBy(allowedClusters[0].value);
    }
  }, [timeframe, clusterBy, allowedClusters]);

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
        <ResponsiveGraph timeframe={timeframe} clusterBy={clusterBy} />
      </div>
    </div>
  );
}

