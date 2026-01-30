"use client";

import { useState, useMemo, useEffect } from "react";
import { FlightSearchForm } from "@/components/flight/flight-search-form";
import { FlightCard } from "@/components/flight/flight-card";
import { FlightDetailModal } from "@/components/flight/flight-detail-modal";
import { FlightFilters } from "@/components/flight/flight-filters";
import { FeaturedFlights } from "@/components/flight/featured-flights";
import { PriceGraph } from "@/components/flight/price-graph";
import { FlightService } from "@/lib/flight-service";
import {
  FlightSearchParams,
  FlightFilters as Filters,
  FlightOffer,
} from "@/types/flight";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plane } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RECENT_SEARCHES_KEY = "spotfly.recentSearches";
const MAX_RECENT_SEARCHES = 5;

interface RecentSearch {
  id: string;
  label: string;
  createdAt: number;
  params: FlightSearchParams;
}

export default function Home() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(
    null,
  );
  const [filters, setFilters] = useState<Filters>({});
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("relevant");
  const [visibleCount, setVisibleCount] = useState(100);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["flights", searchParams, visibleCount],
    queryFn: () =>
      FlightService.searchFlights({
        ...searchParams!,
        max: visibleCount,
      }),
    enabled: !!searchParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allFlights = useMemo(() => data?.data || [], [data]);

  // Apply filters to flights
  const filteredFlights = useMemo(() => {
    let flights =
      Object.keys(filters).length === 0
        ? allFlights
        : FlightService.filterFlights(allFlights, filters);

    // Apply sorting
    if (sortBy === "price-low") {
      flights = [...flights].sort(
        (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total),
      );
    } else if (sortBy === "price-high") {
      flights = [...flights].sort(
        (a, b) => parseFloat(b.price.total) - parseFloat(a.price.total),
      );
    } else if (sortBy === "duration") {
      flights = [...flights].sort((a, b) => {
        const durationA = FlightService.parseDuration(
          a.itineraries[0]?.duration || "",
        );
        const durationB = FlightService.parseDuration(
          b.itineraries[0]?.duration || "",
        );
        return durationA - durationB;
      });
    }
    // "relevant" keeps original order

    return flights;
  }, [allFlights, filters, sortBy]);

  // useEffect(() => {
  //   setVisibleCount(50);
  // }, [filters, sortBy, searchParams]);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as RecentSearch[];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentSearches(parsed);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const buildRecentLabel = (params: FlightSearchParams) => {
    const dep = formatShortDate(params.departureDate);
    const ret = formatShortDate(params.returnDate);
    const travelers = params.children
      ? `${params.adults}A, ${params.children}C`
      : `${params.adults}A`;
    const dates = ret ? `${dep} - ${ret}` : dep;
    return `${params.originLocationCode} → ${params.destinationLocationCode} • ${dates} • ${travelers}`;
  };

  const saveRecentSearch = (params: FlightSearchParams) => {
    const id = [
      params.originLocationCode,
      params.destinationLocationCode,
      params.departureDate,
      params.returnDate ?? "one-way",
      params.adults,
      params.children ?? 0,
      params.travelClass ?? "ECONOMY",
    ].join("|");

    const entry: RecentSearch = {
      id,
      label: buildRecentLabel(params),
      createdAt: Date.now(),
      params,
    };

    setRecentSearches((prev) => {
      const next = [entry, ...prev.filter((item) => item.id !== id)].slice(
        0,
        MAX_RECENT_SEARCHES,
      );
      if (typeof window !== "undefined") {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const handleSearch = (params: FlightSearchParams) => {
    setSearchParams(params);
    setFilters({}); // Reset filters on new search
    setVisibleCount(100);
    saveRecentSearch(params);
  };

  const handleRecentSearch = (params: FlightSearchParams) => {
    setSearchParams(params);
    setFilters({});
    setSortBy("relevant");
    setVisibleCount(100);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  };

  const handleFlightSelect = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      // Small delay before clearing selected flight to prevent re-trigger
      setTimeout(() => {
        setSelectedFlight(null);
      }, 100);
    }
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
  console.log({ priceGraphData }, "priceGraphData");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-border/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
              <Plane className="h-6 w-6" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                SpotFly
              </h1>
              <p className="text-xs font-medium text-muted-foreground">
                Smart flight search & real-time deals
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <video
          className="h-[50vh] w-full object-cover"
          src="/takeoff.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0">
          <div className="container mx-auto h-full px-4">
            <div className="flex h-full items-end">
              <div className="h-1/2 w-full">
                <FlightSearchForm
                  onSearch={handleSearch}
                  loading={isLoading}
                  initialParams={searchParams ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main */}
      <main className="container mx-auto px-4 py-8 mt-[550px] md:mt-[200px]">
        {recentSearches.length > 0 && (
          <div className="mb-6 rounded-xl border border-border/60 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Recent searches
              </h3>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition"
                onClick={handleClearRecent}
              >
                Clear
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item.id}
                  className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/60 transition"
                  onClick={() => handleRecentSearch(item.params)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Results Section */}
        {searchParams && (
          <div className="space-y-8">
            {/* Featured Flights - Quick Picks */}
            {allFlights.length > 0 && (
              <FeaturedFlights
                flights={allFlights}
                onSelectFlight={handleFlightSelect}
              />
            )}

            {/* Price Graph */}
            {filteredFlights.length > 0 && (
              <PriceGraph
                data={priceGraphData}
                currency={filteredFlights[0]?.price.currency}
              />
            )}

            <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <FlightFilters
                  airlines={airlines}
                  priceRange={priceRange}
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </DialogContent>
            </Dialog>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex min-h-[50vh] w-full items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">
                    Searching for flights...
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Filters Sidebar */}
                {allFlights.length > 0 && (
                  <div className="hidden lg:block lg:order-1">
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                          {filteredFlights.length} flight
                          {filteredFlights.length !== 1 ? "s" : ""} found
                        </p>
                        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs font-medium text-foreground shadow-sm transition hover:bg-accent/60 sm:hidden"
                            onClick={() => setFiltersOpen(true)}
                          >
                            Filters
                          </button>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Sort by:
                            </label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="relevant">
                                  Relevant
                                </SelectItem>
                                <SelectItem value="price-low">
                                  Price: Low to High
                                </SelectItem>
                                <SelectItem value="price-high">
                                  Price: High to Low
                                </SelectItem>
                                <SelectItem value="duration">
                                  Shortest Duration
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      {filteredFlights.map((flight) => (
                        <FlightCard
                          key={flight.id}
                          flight={flight}
                          onClick={() => handleFlightSelect(flight)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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

      {/* Flight Detail Modal */}
      {/* {selectedFlight && ( */}
      <FlightDetailModal
        flight={selectedFlight}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
      {/* )} */}
    </div>
  );
}
