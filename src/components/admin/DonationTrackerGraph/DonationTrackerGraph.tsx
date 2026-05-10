"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import "./DonationTrackerGraph.css";

type DataPoint = {
  date: string;
  value: number;
};

const data: DataPoint[] = [];
for (let num = 30; num > 0; num--) {
  data.push({
    date: subDays(new Date(), num).toISOString().substring(0, 10),
    value: Math.floor(Math.random() * 10),
  });
}

export default function DonationTrackerGraph() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4379ee" stopOpacity={0.5}></stop>
            <stop offset="75%" stopColor="#4379ee" stopOpacity={0.05}></stop>
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          stroke="#4379ee"
          fill="url(#color)"
          strokeWidth={2}
          dot={{
            r: 3, // size of dot
            fill: "#4379ee", // dot color
            fillOpacity: 1,
          }}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(str) => {
            const date = parseISO(str);
            if (date.getDate() % 2 === 0) {
              return format(date, "M/d");
            } else {
              return "";
            }
          }}
        />
        <YAxis
          dataKey="value"
          axisLine={false}
          tickLine={false}
          tickCount={6}
        />
        <Tooltip content={<CustomToolTip active={false} payload={[]} label="" />} />
        <CartesianGrid opacity={0.3} vertical={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type ToolProps = {
  active: boolean;
  payload: {
    value: number;
  }[];
  label: string;
};

function CustomToolTip({ active, payload, label }: ToolProps) {
  if (active) {
    return (
      <div className="tooltip">
        <h4>{format(parseISO(label), "eeee, MMM, d")}</h4>
        <p>Donations Recieved: {payload[0].value}</p>
      </div>
    );
  }
  return null;
}