"use client";

import { useState } from "react";
import { LocationSearch } from "./location-search";
import { Airport, FlightSearchParams } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  FaPlaneArrival,
  FaPlaneDeparture,
  FaCalendar,
  FaSearch,
  FaExchangeAlt,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  loading?: boolean;
}

export function FlightSearchForm({ onSearch, loading }: FlightSearchFormProps) {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(
    "round-trip",
  );
  const [adults, setAdults] = useState("1");
  const [travelClass, setTravelClass] = useState<string>("ECONOMY");

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      return;
    }

    const params: FlightSearchParams = {
      originLocationCode: origin.iataCode,
      destinationLocationCode: destination.iataCode,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      adults: parseInt(adults),
      travelClass: travelClass as
        | "ECONOMY"
        | "PREMIUM_ECONOMY"
        | "BUSINESS"
        | "FIRST",
      max: 100,
    };

    if (tripType === "round-trip" && returnDate) {
      params.returnDate = format(returnDate, "yyyy-MM-dd");
    }

    onSearch(params);
  };

  const canSearch = origin && destination && departureDate;

  return (
    <div className="w-full bg-white dark:bg-card rounded-2xl shadow-lg p-6 border border-border">
      <div className="flex flex-col gap-6">
        {/* Trip Type Selection */}
        <div className="flex gap-4">
          <Button
            variant={tripType === "round-trip" ? "default" : "outline"}
            onClick={() => setTripType("round-trip")}
            className="flex-1"
          >
            Round Trip
          </Button>
          <Button
            variant={tripType === "one-way" ? "default" : "outline"}
            onClick={() => setTripType("one-way")}
            className="flex-1"
          >
            One Way
          </Button>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <LocationSearch
              value={origin}
              onChange={setOrigin}
              placeholder="Origin"
              icon={
                <FaPlaneDeparture className="h-4 w-4 text-muted-foreground" />
              }
            />
          </div>

          <div className="hidden md:flex items-end pb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwap}
              className="rounded-full"
            >
              <FaExchangeAlt className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <LocationSearch
              value={destination}
              onChange={setDestination}
              placeholder="Destination"
              icon={
                <FaPlaneArrival className="h-4 w-4 text-muted-foreground" />
              }
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Departure Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !departureDate && "text-muted-foreground",
                  )}
                >
                  <FaCalendar className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {tripType === "round-trip" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Return Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground",
                    )}
                  >
                    <FaCalendar className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) =>
                      date < new Date() ||
                      !!(departureDate && date < departureDate)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Passengers</label>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Adult" : "Adults"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Select value={travelClass} onValueChange={setTravelClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECONOMY">Economy</SelectItem>
                <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="FIRST">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!canSearch || loading}
          size="lg"
          className="w-full"
        >
          <FaSearch className="mr-2 h-4 w-4" />
          {loading ? "Searching..." : "Search Flights"}
        </Button>
      </div>
    </div>
  );
}
