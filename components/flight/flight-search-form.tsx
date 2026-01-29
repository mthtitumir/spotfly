/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
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
import { ArrowRight, ArrowRightLeft, Repeat } from "lucide-react";

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  loading?: boolean;
  initialParams?: FlightSearchParams;
}

export function FlightSearchForm({
  onSearch,
  loading,
  initialParams,
}: FlightSearchFormProps) {
  const today = new Date();
  const defaultDeparture = new Date(today);
  defaultDeparture.setDate(today.getDate() + 1);
  const defaultReturn = new Date(today);
  defaultReturn.setDate(today.getDate() + 4);

  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date>(defaultDeparture);
  const [returnDate, setReturnDate] = useState<Date | undefined>(defaultReturn);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [travelClass, setTravelClass] = useState<string>("ECONOMY");

  const toAirportFromCode = (iataCode: string): Airport => ({
    id: iataCode,
    iataCode,
    name: iataCode,
    cityName: iataCode,
    countryCode: "",
  });

  useEffect(() => {
    if (!initialParams) return;

    setOrigin(
      initialParams.originLocationCode
        ? toAirportFromCode(initialParams.originLocationCode)
        : null,
    );
    setDestination(
      initialParams.destinationLocationCode
        ? toAirportFromCode(initialParams.destinationLocationCode)
        : null,
    );
    setDepartureDate(new Date(initialParams.departureDate));
    setReturnDate(
      initialParams.returnDate ? new Date(initialParams.returnDate) : undefined,
    );
    setTripType(initialParams.returnDate ? "round-trip" : "one-way");
    setAdults(String(initialParams.adults ?? 1));
    setChildren(String(initialParams.children ?? 0));
    setTravelClass(initialParams.travelClass ?? "ECONOMY");
  }, [initialParams]);

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
      children: parseInt(children) > 0 ? parseInt(children) : undefined,
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
    <div className="w-full rounded-xl p-6 border border-white/20 bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-lg">
      <div className="flex flex-col gap-6">
        {/* Trip Type Selection */}
        <div className="flex gap-4">
          <Button
            variant={tripType === "one-way" ? "default" : "outline"}
            onClick={() => setTripType("one-way")}
            className="flex-1"
          >
            One Way
          </Button>
          <Button
            variant={tripType === "round-trip" ? "default" : "outline"}
            onClick={() => setTripType("round-trip")}
            className="flex-1"
          >
            Round Trip
          </Button>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center justify-center">
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

          <div className="hidden md:flex items-center justify-center mt-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwap}
              className="rounded-full"
            >
              {tripType === "one-way" ? <ArrowRight /> : <ArrowRightLeft />}
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
                  onSelect={(date) => {
                    if (date) setDepartureDate(date);
                  }}
                  disabled={(date) => date < new Date()}
                  autoFocus
                  required={false}
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
                    onSelect={(date) => {
                      if (date) setReturnDate(date);
                    }}
                    disabled={(date) =>
                      date < new Date() ||
                      !!(departureDate && date < departureDate)
                    }
                    autoFocus
                    required={false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Adults</label>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger className="w-full">
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
            <p className="text-xs text-muted-foreground">Age 12+</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Children</label>
            <Select value={children} onValueChange={setChildren}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Child" : "Children"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Age 2-11</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Total</label>
            <div className="flex items-center justify-center h-10 rounded-md border border-input bg-background px-3 py-2">
              <p className="text-sm font-medium">
                {parseInt(adults) + parseInt(children)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Passengers</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Select value={travelClass} onValueChange={setTravelClass}>
              <SelectTrigger className="w-full">
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
