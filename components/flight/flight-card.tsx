"use client";

import { FlightOffer, AIRLINE_NAMES } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlightService } from "@/lib/flight-service";
import { FaPlane, FaClock, FaSuitcase } from "react-icons/fa";
import { format } from "date-fns";
import { Clock, Plane } from "lucide-react";

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
    // <Card className="p-6 hover:shadow-lg transition-shadow rounded-md">
    //   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    //     {/* Flight Info */}
    //     <div className="flex-1 space-y-4">
    //       {/* Airline */}
    //       <div className="flex items-center gap-2">
    //         <Badge variant="outline">{airline}</Badge>
    //         <span className="text-sm text-muted-foreground">{airlineName}</span>
    //       </div>

    //       {/* Route and Times */}
    //       <div className="flex items-center gap-4">
    //         <div className="flex-1">
    //           <div className="text-2xl font-bold">
    //             {format(departureTime, "HH:mm")}
    //           </div>
    //           <div className="text-sm text-muted-foreground">
    //             {firstSegment.departure.iataCode}
    //           </div>
    //         </div>

    //         <div className="flex-1 flex flex-col items-center px-4">
    //           <div className="text-sm text-muted-foreground mb-1.5">
    //             {duration}
    //           </div>
    //           <div className="w-full relative">
    //             <div className="border-t-1 border-border"></div>
    //             <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary rotate-90" />
    //           </div>
    //           <div className="text-xs text-muted-foreground mt-1.5">
    //             {stops === 0
    //               ? "Nonstop"
    //               : `${stops} ${stops === 1 ? "stop" : "stops"}`}
    //           </div>
    //         </div>

    //         <div className="flex-1 text-right">
    //           <div className="text-2xl font-bold">
    //             {format(arrivalTime, "HH:mm")}
    //           </div>
    //           <div className="text-sm text-muted-foreground">
    //             {lastSegment.arrival.iataCode}
    //           </div>
    //         </div>
    //       </div>

    //       {/* Stops Details */}
    //       {stops > 0 && (
    //         <div className="text-xs text-muted-foreground">
    //           via{" "}
    //           {outbound.segments
    //             .slice(0, -1)
    //             .map((seg) => seg.arrival.iataCode)
    //             .join(", ")}
    //         </div>
    //       )}
    //     </div>

    //     {/* Price and Action */}
    //     <div className="lg:border-l lg:pl-6 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
    //       <div className="text-right">
    //         <div className="text-3xl font-bold">
    //           {currency} {price.toLocaleString()}
    //         </div>
    //         <div className="text-sm text-muted-foreground">per person</div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Additional Info */}
    //   <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
    //     <div className="flex items-center gap-2">
    //       <Clock className="h-4 w-4" />
    //       <span>Flight: {firstSegment.number}</span>
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <FaSuitcase className="h-4 w-4" />
    //       <span>
    //         {flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin ||
    //           "Economy"}
    //       </span>
    //     </div>
    //     {flight.numberOfBookableSeats <= 5 && (
    //       <Badge variant="destructive">
    //         Only {flight.numberOfBookableSeats} seats left
    //       </Badge>
    //     )}
    //   </div>
    // </Card>
    <div className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-card via-card to-card/95 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-accent/40">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative space-y-6">
        {/* Header with Airline and Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xs font-bold text-primary">{airline}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-foreground">
                {airlineName}
              </p>
              <p className="text-xs text-muted-foreground">
                {firstSegment.number}
              </p>
            </div>
          </div>
          {flight.numberOfBookableSeats <= 5 && (
            <Badge variant="destructive" className="animate-pulse">
              Only {flight.numberOfBookableSeats} seats
            </Badge>
          )}
        </div>

        {/* Main Flight Route */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="flex-1">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {format(departureTime, "HH:mm")}
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {firstSegment.departure.iataCode}
              </p>
            </div>

            {/* Flight Path with Duration */}
            <div className="flex flex-1 flex-col items-center gap-2 px-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {duration}
              </span>
              <div className="relative w-full my-1.5">
                <div className="h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card p-2 shadow-md">
                  <Plane className="h-4 w-4 text-primary" />
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {stops === 0 ? (
                  <span className="inline-block rounded-full bg-green-50 px-2 py-1 text-green-700">
                    Nonstop
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                    {stops} {stops === 1 ? "stop" : "stops"}
                  </span>
                )}
              </span>
            </div>

            {/* Arrival */}
            <div className="flex-1 text-right">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {format(arrivalTime, "HH:mm")}
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {lastSegment.arrival.iataCode}
              </p>
            </div>
          </div>

          {/* Stops Details */}
          {stops > 0 && (
            <div className="rounded-lg bg-accent/5 px-3 py-2 text-xs text-muted-foreground">
              Via{" "}
              <span className="font-medium text-foreground">
                {outbound.segments
                  .slice(0, -1)
                  .map((seg) => seg.arrival.iataCode)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer with Amenities and Price */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FaSuitcase className="h-3.5 w-3.5 text-primary/60" />
              <span>
                {flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin ||
                  "Economy"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-center sm:text-right">
              <div className="text-4xl font-bold tracking-tight text-primary">
                {currency} {price.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
            {/* <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg"
              size="sm"
            >
              Select Flight
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
