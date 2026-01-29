"use client";

import { FlightOffer, AIRLINE_NAMES } from "@/types/flight";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FlightService } from "@/lib/flight-service";
import { format } from "date-fns";
import { FaPlane, FaSuitcase, FaCheckCircle, FaUsers } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FlightDetailModalProps {
  flight: FlightOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FlightDetailModal({
  flight,
  open,
  onOpenChange,
}: FlightDetailModalProps) {
  if (!flight) return null;

  const outbound = flight.itineraries[0];
  const return_flight = flight.itineraries[1];
  const price = parseFloat(flight.price.total);
  const basePrice = parseFloat(flight.price.base);
  const currency = flight.price.currency;
  const airline = flight.validatingAirlineCodes[0];
  const airlineName = AIRLINE_NAMES[airline] || airline;

  const renderItinerary = (itinerary: typeof outbound, title: string) => {
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const stops = itinerary.segments.length - 1;
    const duration = FlightService.formatDuration(itinerary.duration);

    const departureTime = new Date(firstSegment.departure.at);
    const arrivalTime = new Date(lastSegment.arrival.at);

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{title}</h3>

        {/* Main Journey */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl">
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="flex-1">
              <div className="text-3xl font-bold">
                {format(departureTime, "HH:mm")}
              </div>
              <div className="text-muted-foreground">
                {firstSegment.departure.iataCode}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(departureTime, "MMM dd, yyyy")}
              </div>
            </div>

            {/* Journey Info */}
            <div className="flex-1 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                {duration}
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex-1 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                <FaPlane className="text-primary rotate-90" />
                <div className="flex-1 h-0.5 bg-gradient-to-l from-primary to-transparent"></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {stops === 0
                  ? "Nonstop"
                  : `${stops} ${stops === 1 ? "stop" : "stops"}`}
              </div>
            </div>

            {/* Arrival */}
            <div className="flex-1 text-right">
              <div className="text-3xl font-bold">
                {format(arrivalTime, "HH:mm")}
              </div>
              <div className="text-muted-foreground">
                {lastSegment.arrival.iataCode}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(arrivalTime, "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>

        {/* Segments */}
        {stops > 0 && (
          <div className="space-y-3">
            {itinerary.segments.map((segment, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{segment.carrierCode}</Badge>
                      <span className="text-sm font-medium">
                        Flight {segment.number}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Depart</div>
                        <div className="font-semibold">
                          {format(new Date(segment.departure.at), "HH:mm")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {segment.departure.iataCode}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Arrive</div>
                        <div className="font-semibold">
                          {format(new Date(segment.arrival.at), "HH:mm")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {segment.arrival.iataCode}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Duration</div>
                    <div className="font-semibold">
                      {FlightService.formatDuration(segment.duration)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {segment.aircraft.code}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Flight Details</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="space-y-6 pr-4">
            {/* Header with Airline and Price */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary">{airline}</Badge>
                  <span className="font-semibold">{airlineName}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {flight.lastTicketingDate
                    ? `Book by ${format(
                        new Date(flight.lastTicketingDate),
                        "MMM dd, yyyy",
                      )}`
                    : "Book soon"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">
                  {currency} {price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>
            </div>

            {/* Outbound Itinerary */}
            {renderItinerary(outbound, "Outbound Flight")}

            {/* Return Itinerary */}
            {return_flight && renderItinerary(return_flight, "Return Flight")}

            {/* Pricing Breakdown */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Pricing Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span>
                    {currency} {basePrice.toLocaleString()}
                  </span>
                </div>
                {flight.price.fees && flight.price.fees.length > 0 && (
                  <>
                    {flight.price.fees.map((fee, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {fee.type}
                        </span>
                        <span>
                          +{currency} {parseFloat(fee.amount)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {currency} {price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Passenger & Baggage Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaUsers className="text-primary" />
                  <h3 className="font-semibold">Passengers</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adults</span>
                    <span className="font-semibold">
                      {flight.travelerPricings.length}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaSuitcase className="text-primary" />
                  <h3 className="font-semibold">Baggage</h3>
                </div>
                <div className="space-y-1 text-sm">
                  {flight.travelerPricings[0]?.fareDetailsBySegment[0]
                    ?.includedCheckedBags?.quantity ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Checked Bags
                      </span>
                      <span className="font-semibold">
                        {
                          flight.travelerPricings[0].fareDetailsBySegment[0]
                            .includedCheckedBags.quantity
                        }{" "}
                        included
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Check fare details
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Cabin & Seats Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Cabin Class</h3>
                <div className="space-y-1 text-sm">
                  {flight.travelerPricings[0]?.fareDetailsBySegment[0]
                    ?.cabin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class</span>
                      <Badge variant="outline">
                        {
                          flight.travelerPricings[0].fareDetailsBySegment[0]
                            .cabin
                        }
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span
                      className={`font-semibold ${
                        flight.numberOfBookableSeats <= 5
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {flight.numberOfBookableSeats} available
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Highlights */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Why Choose This Flight?
              </h3>
              <ul className="space-y-2 text-sm">
                {outbound.segments.length === 1 && (
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span>Nonstop flight - save time</span>
                  </li>
                )}
                {flight.numberOfBookableSeats <= 5 && (
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span>Limited seats - book now</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 flex-shrink-0" />
                  <span>Instant booking confirmation</span>
                </li>
              </ul>
            </Card>

            {/* CTA Buttons */}
            <div className="flex gap-3 sticky bottom-0 bg-background pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Back to Results
              </Button>
              <Button className="flex-1">
                Book Now - {currency} {price.toLocaleString()}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
