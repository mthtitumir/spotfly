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
      setResults([]);
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-left">
              {value ? (
                <div>
                  <div className="font-semibold">{value.iataCode}</div>
                  <div className="text-xs text-muted-foreground">
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
        <Command shouldFilter={false}>
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
              {results.map((airport, index) => (
                <CommandItem
                  key={index}
                  value={airport.iataCode}
                  onSelect={() => {
                    onChange(airport);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <div className="font-semibold">
                      {airport.iataCode} - {airport.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {airport.cityName}, {airport.countryCode}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
