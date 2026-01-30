"use client";

import { PricePoint, AIRLINE_NAMES } from "@/types/flight";
import { Card } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from "recharts";
import { format } from "date-fns";
import { FlightService } from "@/lib/flight-service";

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

  const formattedData = data?.map((point, index) => ({
    ...point,
    displayDate: format(new Date(point.departureTime), "MMM dd"),
    displayTime: format(new Date(point.departureTime), "HH:mm"),
    index, // X-axis position
  }));

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const avgPrice = Math.round(
    data.reduce((sum, d) => sum + d.price, 0) / data.length,
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* header */}
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

        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={450} minWidth={800}>
            <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="index"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => `${value + 1}`}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                domain={[
                  Math.floor(minPrice * 0.95),
                  Math.ceil(maxPrice * 1.05),
                ]}
                tickFormatter={(value) => `${currency} ${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const flight = payload[0]
                      .payload as (typeof formattedData)[0];
                    const airlineName =
                      AIRLINE_NAMES[flight.airline] || flight.airline;

                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-4 min-w-[250px]">
                        <div className="space-y-2">
                          <div className="border-b pb-2">
                            <p className="font-bold text-lg">
                              {currency} {flight.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Airline:
                              </span>
                              <span className="font-semibold">
                                {airlineName}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Route:
                              </span>
                              <span className="font-semibold">
                                {flight.origin} → {flight.destination}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Departure:
                              </span>
                              <span className="font-semibold">
                                {flight.displayDate} {flight.displayTime}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Duration:
                              </span>
                              <span className="font-semibold">
                                {FlightService.formatDuration(flight.duration)}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Stops:
                              </span>
                              <span className="font-semibold">
                                {flight.stops === 0
                                  ? "Nonstop"
                                  : `${flight.stops} ${flight.stops === 1 ? "stop" : "stops"}`}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Seats:
                              </span>
                              <span
                                className={`font-semibold ${flight.seats <= 5 ? "text-red-600" : "text-green-600"}`}
                              >
                                {flight.seats} available
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                data={formattedData}
                dataKey="price"
                fill="oklch(0.208 0.042 265.755)"
                shape="star"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
