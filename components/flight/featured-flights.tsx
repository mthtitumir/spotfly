"use client";

import { FlightOffer, AIRLINE_NAMES } from "@/types/flight";
import { FlightService } from "@/lib/flight-service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FaPlane,
  FaFire,
  FaBolt,
  FaWind,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import { format } from "date-fns";

interface FeaturedFlightsProps {
  flights: FlightOffer[];
  onSelectFlight: (flight: FlightOffer) => void;
}

export function FeaturedFlights({
  flights,
  onSelectFlight,
}: FeaturedFlightsProps) {
  if (flights.length === 0) return null;

  const cheapestFlights = FlightService.getCheapestFlights(flights, 1);
  const quickestFlights = FlightService.getQuickestFlights(flights, 1);
  const bestValueFlights = FlightService.getBestValueFlights(flights, 1);
  const nonstopFlights = FlightService.getNonstopFlights(flights, 1);

  const featuredCategories = [
    {
      title: "Cheapest",
      icon: FaFire,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      flights: cheapestFlights,
      label: "Best Price",
    },
    {
      title: "Quickest",
      icon: FaBolt,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      flights: quickestFlights,
      label: "Fastest",
    },
    {
      title: "Best Value",
      icon: FaWind,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      flights: bestValueFlights,
      label: "Balanced",
    },
    {
      title: "Nonstop",
      icon: FaCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      flights: nonstopFlights,
      label: "Direct Flight",
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Quick Picks
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featuredCategories.map((category) => {
          const flight = category.flights[0];
          if (!flight) return null;

          const outbound = flight.itineraries[0];
          const firstSegment = outbound.segments[0];
          const lastSegment = outbound.segments[outbound.segments.length - 1];
          const stops = outbound.segments.length - 1;
          const duration = FlightService.formatDuration(outbound.duration);

          const departureTime = new Date(firstSegment.departure.at);
          const arrivalTime = new Date(lastSegment.arrival.at);

          const price = parseFloat(flight.price.total);
          const currency = flight.price.currency;

          const airline = flight.validatingAirlineCodes[0];
          const airlineName = AIRLINE_NAMES[airline] || airline;

          const IconComponent = category.icon;

          return (
            <Card
              key={`${category.title}-${flight.id}`}
              className={`group relative overflow-hidden border-0 p-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer ${category.bgColor}`}
              onClick={() => onSelectFlight(flight)}
            >
              {/* Header with badge */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg p-2 ${category.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${category.color}`} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category.title}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {category.label}
                </Badge>
              </div>

              {/* Flight Details */}
              <div className="space-y-3">
                {/* Airline */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground">
                    {airline}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {airlineName}
                  </span>
                </div>

                {/* Route and Times */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        {format(departureTime, "HH:mm")}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {firstSegment.departure.iataCode}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {duration}
                      </span>
                      <FaPlane className="h-3 w-3 text-primary rotate-90" />
                      <span className="text-xs font-semibold text-foreground">
                        {stops === 0 ? (
                          <span className="inline-block rounded-full bg-green-100 px-1.5 py-0.5 text-green-700 dark:bg-green-900 dark:text-green-200">
                            Nonstop
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {stops} {stops === 1 ? "stop" : "stops"}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {format(arrivalTime, "HH:mm")}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {lastSegment.arrival.iataCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/50" />

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {currency} {price.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFlight(flight);
                    }}
                  >
                    <span className="hidden sm:inline">View</span>
                    <FaArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
