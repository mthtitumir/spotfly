"use client";

import { useState, useEffect } from "react";
import { FlightFilters as Filters } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AIRLINE_NAMES } from "@/types/flight";
import { FaFilter, FaTimes } from "react-icons/fa";

interface FlightFiltersProps {
  airlines: string[];
  priceRange: [number, number];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function FlightFilters({
  airlines,
  priceRange,
  filters,
  onChange,
  onReset,
}: FlightFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handlePriceChange = (value: number[]) => {
    const newFilters = {
      ...localFilters,
      minPrice: value[0],
      maxPrice: value[1],
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleStopsChange = (stops: number, checked: boolean) => {
    const currentStops = localFilters.stops || [];
    const newStops = checked
      ? [...currentStops, stops]
      : currentStops.filter((s) => s !== stops);

    const newFilters = {
      ...localFilters,
      stops: newStops.length > 0 ? newStops : undefined,
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const currentAirlines = localFilters.airlines || [];
    const newAirlines = checked
      ? [...currentAirlines, airline]
      : currentAirlines.filter((a) => a !== airline);

    const newFilters = {
      ...localFilters,
      airlines: newAirlines.length > 0 ? newAirlines : undefined,
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const hasActiveFilters =
    (localFilters.stops && localFilters.stops.length > 0) ||
    (localFilters.airlines && localFilters.airlines.length > 0) ||
    localFilters.minPrice !== priceRange[0] ||
    localFilters.maxPrice !== priceRange[1];

  return (
    <Card className="p-6 sticky top-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilter className="h-4 w-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2"
            >
              <FaTimes className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="space-y-2">
            <Slider
              min={priceRange[0]}
              max={priceRange[1]}
              step={10}
              value={[
                localFilters.minPrice || priceRange[0],
                localFilters.maxPrice || priceRange[1],
              ]}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${localFilters.minPrice || priceRange[0]}</span>
              <span>${localFilters.maxPrice || priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Stops */}
        <div className="space-y-4">
          <Label>Stops</Label>
          <div className="space-y-2">
            {[0, 1, 2].map((stops) => (
              <div key={stops} className="flex items-center space-x-2">
                <Checkbox
                  id={`stops-${stops}`}
                  checked={localFilters.stops?.includes(stops) || false}
                  onCheckedChange={(checked) =>
                    handleStopsChange(stops, checked as boolean)
                  }
                />
                <label
                  htmlFor={`stops-${stops}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {stops === 0
                    ? "Nonstop"
                    : `${stops} ${stops === 1 ? "stop" : "stops"}`}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Airlines */}
        {airlines.length > 0 && (
          <div className="space-y-4">
            <Label>Airlines</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {airlines.map((airline) => (
                <div key={airline} className="flex items-center space-x-2">
                  <Checkbox
                    id={`airline-${airline}`}
                    checked={localFilters.airlines?.includes(airline) || false}
                    onCheckedChange={(checked) =>
                      handleAirlineChange(airline, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`airline-${airline}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    <div>{AIRLINE_NAMES[airline] || airline}</div>
                    <div className="text-xs text-muted-foreground">
                      {airline}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
