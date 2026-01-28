"use client";

import { FlightOffer, AIRLINE_NAMES } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlightService } from "@/lib/flight-service";
import { FaPlane, FaClock, FaSuitcase } from "react-icons/fa";
import { format } from "date-fns";

interface FlightCardProps {
  flight: FlightOffer;
}

export function FlightCard({ flight }: FlightCardProps) {
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

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Flight Info */}
        <div className="flex-1 space-y-4">
          {/* Airline */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">{airline}</Badge>
            <span className="text-sm text-muted-foreground">{airlineName}</span>
          </div>

          {/* Route and Times */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-2xl font-bold">
                {format(departureTime, "HH:mm")}
              </div>
              <div className="text-sm text-muted-foreground">
                {firstSegment.departure.iataCode}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center px-4">
              <div className="text-sm text-muted-foreground mb-1">
                {duration}
              </div>
              <div className="w-full relative">
                <div className="border-t-2 border-border"></div>
                <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary rotate-90" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stops === 0
                  ? "Nonstop"
                  : `${stops} ${stops === 1 ? "stop" : "stops"}`}
              </div>
            </div>

            <div className="flex-1 text-right">
              <div className="text-2xl font-bold">
                {format(arrivalTime, "HH:mm")}
              </div>
              <div className="text-sm text-muted-foreground">
                {lastSegment.arrival.iataCode}
              </div>
            </div>
          </div>

          {/* Stops Details */}
          {stops > 0 && (
            <div className="text-xs text-muted-foreground">
              via{" "}
              {outbound.segments
                .slice(0, -1)
                .map((seg) => seg.arrival.iataCode)
                .join(", ")}
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="lg:border-l lg:pl-6 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
          <div className="text-right">
            <div className="text-3xl font-bold">
              {currency} {price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">per person</div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <FaClock className="h-4 w-4" />
          <span>Flight: {firstSegment.number}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaSuitcase className="h-4 w-4" />
          <span>
            {flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin ||
              "Economy"}
          </span>
        </div>
        {flight.numberOfBookableSeats <= 5 && (
          <Badge variant="destructive">
            Only {flight.numberOfBookableSeats} seats left
          </Badge>
        )}
      </div>
    </Card>
  );
}
