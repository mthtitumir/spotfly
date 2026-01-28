"use client";

import { PricePoint } from "@/types/flight";
import { Card } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";

interface PriceGraphProps {
  data: PricePoint[];
  currency?: string;
}

export function PriceGraph({ data, currency = "USD" }: PriceGraphProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No price data available
        </div>
      </Card>
    );
  }

  const formattedData = data.map((point) => ({
    ...point,
    displayDate: format(new Date(point.date), "MMM dd"),
  }));

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const avgPrice = Math.round(
    data.reduce((sum, d) => sum + d.price, 0) / data.length,
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Price Trends</h3>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Avg: </span>
              <span className="font-semibold">
                {currency} {avgPrice}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Min: </span>
              <span className="font-semibold text-green-600">
                {currency} {minPrice}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Max: </span>
              <span className="font-semibold text-red-600">
                {currency} {maxPrice}
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              domain={[Math.floor(minPrice * 0.95), Math.ceil(maxPrice * 1.05)]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                      <p className="font-semibold">
                        {payload[0].payload.displayDate}
                      </p>
                      <p className="text-sm text-primary">
                        Price: {currency} {payload[0].value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].payload.count} flight
                        {payload[0].payload.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
