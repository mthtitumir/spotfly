"use client";

import { useState, useMemo } from "react";
import { FlightSearchForm } from "@/components/flight/flight-search-form";
import { FlightCard } from "@/components/flight/flight-card";
import { FlightFilters } from "@/components/flight/flight-filters";
import { PriceGraph } from "@/components/flight/price-graph";
import { FlightService } from "@/lib/flight-service";
import { FlightSearchParams, FlightFilters as Filters } from "@/types/flight";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plane } from "lucide-react";

export default function Home() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(
    null,
  );
  const [filters, setFilters] = useState<Filters>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["flights", searchParams],
    queryFn: () => FlightService.searchFlights(searchParams!),
    enabled: !!searchParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allFlights = data?.data || [];

  // Apply filters to flights
  const filteredFlights = useMemo(() => {
    if (Object.keys(filters).length === 0) return allFlights;
    return FlightService.filterFlights(allFlights, filters);
  }, [allFlights, filters]);

  // Extract unique airlines
  const airlines = useMemo(() => {
    return FlightService.extractUniqueAirlines(allFlights);
  }, [allFlights]);

  // Get price range
  const priceRange = useMemo(() => {
    return FlightService.getPriceRange(allFlights);
  }, [allFlights]);

  // Generate price graph data
  const priceGraphData = useMemo(() => {
    return FlightService.generatePriceGraph(filteredFlights);
  }, [filteredFlights]);

  const handleSearch = (params: FlightSearchParams) => {
    setSearchParams(params);
    setFilters({}); // Reset filters on new search
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  if (error) {
    toast.error("Failed to search flights. Please try again.");
  }
  console.log(
    {
      allFlights,
      airlines,
      priceRange,
      priceGraphData,
      filters,
      filteredFlights,
    },
    "all-stats",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SpotFly
              </h1>
              <p className="text-sm text-muted-foreground">
                Find your perfect flight
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <FlightSearchForm onSearch={handleSearch} loading={isLoading} />
        </div>

        {/* Results Section */}
        {searchParams && (
          <div className="space-y-8">
            {/* Price Graph */}
            {filteredFlights.length > 0 && (
              <PriceGraph
                data={priceGraphData}
                currency={filteredFlights[0]?.price.currency}
              />
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              {/* Filters Sidebar */}
              {allFlights.length > 0 && (
                <div className="lg:order-1">
                  <FlightFilters
                    airlines={airlines}
                    priceRange={priceRange}
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleResetFilters}
                  />
                </div>
              )}

              {/* Flight List */}
              <div className="lg:order-2">
                {isLoading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">
                        Searching for flights...
                      </p>
                    </div>
                  </div>
                )}

                {!isLoading &&
                  filteredFlights.length === 0 &&
                  allFlights.length > 0 && (
                    <div className="text-center py-20">
                      <p className="text-lg text-muted-foreground">
                        No flights match your filters. Try adjusting your
                        criteria.
                      </p>
                    </div>
                  )}

                {!isLoading && allFlights.length === 0 && searchParams && (
                  <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">
                      No flights found for this route. Try different dates or
                      locations.
                    </p>
                  </div>
                )}

                {filteredFlights.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {filteredFlights.length} flight
                        {filteredFlights.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                    {filteredFlights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchParams && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-primary/10 text-primary p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                <Plane className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold">Ready to explore?</h2>
              <p className="text-muted-foreground">
                Search for flights above to discover the best deals and plan
                your next adventure.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
