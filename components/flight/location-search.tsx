"use client";

import { useState, useEffect, useCallback } from "react";
import { FlightService } from "@/lib/flight-service";
import { Airport } from "@/types/flight";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaPlane } from "react-icons/fa";

interface LocationSearchProps {
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

const TRENDING_LOCATIONS: Airport[] = [
  {
    id: "NYC",
    iataCode: "NYC",
    name: "New York",
    cityName: "New York",
    countryCode: "US",
  },
  {
    id: "LON",
    iataCode: "LON",
    name: "London",
    cityName: "London",
    countryCode: "GB",
  },
  {
    id: "PAR",
    iataCode: "PAR",
    name: "Paris",
    cityName: "Paris",
    countryCode: "FR",
  },
  {
    id: "TYO",
    iataCode: "TYO",
    name: "Tokyo",
    cityName: "Tokyo",
    countryCode: "JP",
  },
  {
    id: "DXB",
    iataCode: "DXB",
    name: "Dubai",
    cityName: "Dubai",
    countryCode: "AE",
  },
  {
    id: "SIN",
    iataCode: "SIN",
    name: "Singapore",
    cityName: "Singapore",
    countryCode: "SG",
  },
  {
    id: "LAX",
    iataCode: "LAX",
    name: "Los Angeles",
    cityName: "Los Angeles",
    countryCode: "US",
  },
  {
    id: "SFO",
    iataCode: "SFO",
    name: "San Francisco",
    cityName: "San Francisco",
    countryCode: "US",
  },
  {
    id: "FRA",
    iataCode: "FRA",
    name: "Frankfurt",
    cityName: "Frankfurt",
    countryCode: "DE",
  },
  {
    id: "AMS",
    iataCode: "AMS",
    name: "Amsterdam",
    cityName: "Amsterdam",
    countryCode: "NL",
  },
];

export function LocationSearch({
  value,
  onChange,
  placeholder = "Search location...",
  icon,
}: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = useCallback(async (keyword: string) => {
    if (keyword.length < 2) {
      setResults(TRENDING_LOCATIONS);
      return;
    }

    setLoading(true);
    try {
      const locations = await FlightService.searchLocations(keyword);
      setResults(locations);
    } catch (error) {
      console.error("Error searching locations:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, searchLocations]);

  useEffect(() => {
    if (open && search.length < 2) {
      setResults(TRENDING_LOCATIONS);
    }
  }, [open, search.length]);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between font-normal bg-transparent hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-left">
              {value ? (
                <div>
                  {/* <div className="font-semibold">{value.iataCode}</div> */}
                  <div className="font-semibold">
                    {value.cityName || value.name}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </div>
          <FaPlane className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        {/* <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Searching..." : "No locations found."}
            </CommandEmpty>
            <CommandGroup>
              {results?.map((airport, index) => (
                <CommandItem
                  key={airport.id}
                  value={airport.id}
                  onSelect={() => {
                    console.log("Selected airport:", airport);
                    onChange(airport);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <div className="font-semibold">
                      {airport.iataCode} - {airport.name} - {airport.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {airport.cityName}, {airport.countryCode}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command> */}
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3">
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="py-6 text-center text-sm">Searching...</div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-sm">
                No locations found.
              </div>
            ) : (
              <div className="p-1">
                {search.length < 2 && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Trending locations
                  </div>
                )}
                {results?.map((airport) => (
                  <div
                    key={airport.id}
                    onClick={() => handleSelect(airport)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex flex-col">
                      <div className="font-semibold">
                        {airport.iataCode} - {airport.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {airport.cityName}, {airport.countryCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
