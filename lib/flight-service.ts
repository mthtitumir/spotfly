import {
  FlightOffer,
  FlightSearchParams,
  Airport,
  AmadeusFlightSearchResponse,
  AmadeusLocationSearchResponse,
  PricePoint,
  FlightFilters,
} from "@/types/flight";

export class FlightService {
  static async searchLocations(keyword: string): Promise<Airport[]> {
    if (!keyword || keyword.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/flights/locations?keyword=${encodeURIComponent(keyword)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search locations");
      }

      const data: AmadeusLocationSearchResponse = await response.json();

      return data.data.map((location) => ({
        id: location.id,
        iataCode: location.iataCode,
        name: location.name,
        cityName: location.address.cityName,
        countryCode: location.address.countryCode,
      }));
    } catch (error) {
      console.error("Error searching locations:", error);
      throw error;
    }
  }

  static async searchFlights(
    params: FlightSearchParams,
  ): Promise<AmadeusFlightSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
      });

      if (params.returnDate) {
        queryParams.append("returnDate", params.returnDate);
      }
      if (params.children) {
        queryParams.append("children", params.children.toString());
      }
      if (params.travelClass) {
        queryParams.append("travelClass", params.travelClass);
      }
      if (params.nonStop !== undefined) {
        queryParams.append("nonStop", params.nonStop.toString());
      }
      if (params.maxPrice) {
        queryParams.append("maxPrice", params.maxPrice.toString());
      }
      if (params.max) {
        queryParams.append("max", params.max.toString());
      }

      const response = await fetch(
        `/api/flights/search?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search flights");
      }

      const data: AmadeusFlightSearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching flights:", error);
      throw error;
    }
  }

  static filterFlights(
    flights: FlightOffer[],
    filters: FlightFilters,
  ): FlightOffer[] {
    return flights.filter((flight) => {
      const price = parseFloat(flight.price.total);
      const totalStops = flight.itineraries[0]?.segments.length - 1 || 0;
      const airlines = flight.validatingAirlineCodes;

      // Price filter
      if (filters.minPrice !== undefined && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && price > filters.maxPrice) {
        return false;
      }

      // Stops filter
      if (filters.stops && filters.stops.length > 0) {
        if (!filters.stops.includes(totalStops)) {
          return false;
        }
      }

      // Airlines filter
      if (filters.airlines && filters.airlines.length > 0) {
        const hasAirline = airlines.some((airline) =>
          filters.airlines!.includes(airline),
        );
        if (!hasAirline) {
          return false;
        }
      }

      // Departure time filter
      if (filters.departureTimeRange) {
        const departureTime = new Date(
          flight.itineraries[0]?.segments[0]?.departure.at,
        );
        const hour = departureTime.getHours();
        if (
          hour < filters.departureTimeRange[0] ||
          hour > filters.departureTimeRange[1]
        ) {
          return false;
        }
      }

      // Arrival time filter
      if (filters.arrivalTimeRange) {
        const lastSegment =
          flight.itineraries[0]?.segments[
            flight.itineraries[0].segments.length - 1
          ];
        const arrivalTime = new Date(lastSegment?.arrival.at);
        const hour = arrivalTime.getHours();
        if (
          hour < filters.arrivalTimeRange[0] ||
          hour > filters.arrivalTimeRange[1]
        ) {
          return false;
        }
      }

      // Duration filter
      if (filters.maxDuration) {
        const duration = this.parseDuration(flight.itineraries[0]?.duration);
        if (duration > filters.maxDuration) {
          return false;
        }
      }

      return true;
    });
  }

  static parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (e.g., "PT5H30M")
    const hours = duration.match(/(\d+)H/);
    const minutes = duration.match(/(\d+)M/);
    return (
      (hours ? parseInt(hours[1]) * 60 : 0) +
      (minutes ? parseInt(minutes[1]) : 0)
    );
  }

  static formatDuration(duration: string): string {
    const totalMinutes = this.parseDuration(duration);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  //   static generatePriceGraph(flights: FlightOffer[]): PricePoint[] {
  //     const priceMap = new Map<string, { total: number; count: number }>();

  //     flights.forEach((flight) => {
  //       const price = parseFloat(flight.price.total);
  //       const date =
  //         flight.itineraries[0]?.segments[0]?.departure.at.split("T")[0];

  //       if (date) {
  //         const existing = priceMap.get(date) || { total: 0, count: 0 };
  //         priceMap.set(date, {
  //           total: existing.total + price,
  //           count: existing.count + 1,
  //         });
  //       }
  //     });

  //     return Array.from(priceMap.entries())
  //       .map(([date, { total, count }]) => ({
  //         date,
  //         price: Math.round(total / count),
  //         count,
  //       }))
  //       .sort((a, b) => a.date.localeCompare(b.date));
  //   }
  static generatePriceGraph(flights: FlightOffer[]): PricePoint[] {
    return flights.map((flight) => {
      const firstSegment = flight.itineraries[0]?.segments[0];
      const lastSegment =
        flight.itineraries[0]?.segments[
          flight.itineraries[0].segments.length - 1
        ];
      const stops = flight.itineraries[0]?.segments.length - 1 || 0;

      return {
        id: flight.id,
        price: parseFloat(flight.price.total),
        departureTime: firstSegment?.departure.at || "",
        arrivalTime: lastSegment?.arrival.at || "",
        origin: firstSegment?.departure.iataCode || "",
        destination: lastSegment?.arrival.iataCode || "",
        airline: flight.validatingAirlineCodes[0] || "",
        stops,
        duration: flight.itineraries[0]?.duration || "",
        seats: flight.numberOfBookableSeats,
      };
    });
    // .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  static extractUniqueAirlines(flights: FlightOffer[]): string[] {
    const airlines = new Set<string>();
    flights.forEach((flight) => {
      flight.validatingAirlineCodes.forEach((code) => airlines.add(code));
    });
    return Array.from(airlines).sort();
  }

  static getPriceRange(flights: FlightOffer[]): [number, number] {
    if (flights.length === 0) return [0, 1000];

    const prices = flights.map((f) => parseFloat(f.price.total));
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }

  // Get cheapest flights
  static getCheapestFlights(
    flights: FlightOffer[],
    count: number = 3,
  ): FlightOffer[] {
    if (flights.length === 0) return [];

    const sorted = [...flights].sort(
      (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total),
    );

    return sorted.slice(0, Math.min(count, sorted.length));
  }

  // Get quickest flights (shortest duration)
  static getQuickestFlights(
    flights: FlightOffer[],
    count: number = 3,
  ): FlightOffer[] {
    if (flights.length === 0) return [];

    const sorted = [...flights].sort((a, b) => {
      const durationA = this.parseDuration(a.itineraries[0]?.duration || "");
      const durationB = this.parseDuration(b.itineraries[0]?.duration || "");
      return durationA - durationB;
    });

    return sorted.slice(0, Math.min(count, sorted.length));
  }

  // Get fastest departure flights (earliest departure)
  static getFastestDepartures(
    flights: FlightOffer[],
    count: number = 3,
  ): FlightOffer[] {
    if (flights.length === 0) return [];

    const sorted = [...flights].sort((a, b) => {
      const timeA = new Date(a.itineraries[0]?.segments[0]?.departure.at || "");
      const timeB = new Date(b.itineraries[0]?.segments[0]?.departure.at || "");
      return timeA.getTime() - timeB.getTime();
    });

    return sorted.slice(0, Math.min(count, sorted.length));
  }

  // Get best value flights (combination of price and duration)
  static getBestValueFlights(
    flights: FlightOffer[],
    count: number = 3,
  ): FlightOffer[] {
    if (flights.length === 0) return [];

    const priceRange = this.getPriceRange(flights);
    const maxDuration = Math.max(
      ...flights.map((f) =>
        this.parseDuration(f.itineraries[0]?.duration || ""),
      ),
    );

    const scored = flights.map((flight) => {
      const price = parseFloat(flight.price.total);
      const duration = this.parseDuration(
        flight.itineraries[0]?.duration || "",
      );

      // Normalize price and duration to 0-1 scale
      const priceScore =
        (price - priceRange[0]) / (priceRange[1] - priceRange[0]) || 0;
      const durationScore = duration / maxDuration || 0;

      // Weighted score: 60% price, 40% duration
      const score = priceScore * 0.6 + durationScore * 0.4;

      return { flight, score };
    });

    const sorted = scored.sort((a, b) => a.score - b.score);
    return sorted.slice(0, Math.min(count, sorted.length)).map((s) => s.flight);
  }

  // Get nonstop flights
  static getNonstopFlights(
    flights: FlightOffer[],
    count: number = 3,
  ): FlightOffer[] {
    if (flights.length === 0) return [];

    const nonstops = flights.filter((flight) => {
      const segments = flight.itineraries[0]?.segments || [];
      return segments.length === 1;
    });

    // Sort by price
    const sorted = nonstops.sort(
      (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total),
    );

    return sorted.slice(0, Math.min(count, sorted.length));
  }
}
