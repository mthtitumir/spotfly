// Amadeus API Types

export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  cityName?: string;
  countryCode?: string;
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface Itinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
  grandTotal: string;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: {
      weight?: number;
      weightUnit?: string;
      quantity?: number;
    };
  }>;
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
}

export interface FlightFilters {
  maxPrice?: number;
  minPrice?: number;
  stops?: number[]; // [0] for nonstop, [1] for 1 stop, etc.
  airlines?: string[];
  departureTimeRange?: [number, number]; // hours in 24h format
  arrivalTimeRange?: [number, number];
  maxDuration?: number; // in minutes
  cabinClass?: string[];
}

export interface PricePoint {
  id: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  airline: string;
  stops: number;
  duration: string;
  seats: number;
}

export interface AirlineInfo {
  code: string;
  name: string;
}

// Common airline codes
export const AIRLINE_NAMES: Record<string, string> = {
  AA: "American Airlines",
  DL: "Delta Air Lines",
  UA: "United Airlines",
  BA: "British Airways",
  LH: "Lufthansa",
  AF: "Air France",
  KL: "KLM",
  EK: "Emirates",
  QR: "Qatar Airways",
  EY: "Etihad Airways",
  TK: "Turkish Airlines",
  SQ: "Singapore Airlines",
  QF: "Qantas",
  AC: "Air Canada",
  NH: "ANA",
  JL: "Japan Airlines",
  CX: "Cathay Pacific",
  VS: "Virgin Atlantic",
  AS: "Alaska Airlines",
  B6: "JetBlue",
  WN: "Southwest Airlines",
  F9: "Frontier Airlines",
  NK: "Spirit Airlines",
};

export interface AmadeusAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AmadeusFlightSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: FlightOffer[];
  dictionaries?: {
    locations?: Record<string, Airport>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    carriers?: Record<string, string>;
  };
}

export interface AmadeusLocationSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    self: {
      href: string;
      methods: string[];
    };
    timeZoneOffset?: string;
    iataCode: string;
    geoCode?: {
      latitude: number;
      longitude: number;
    };
    address: {
      cityName: string;
      cityCode?: string;
      countryName: string;
      countryCode: string;
      regionCode?: string;
    };
    analytics?: {
      travelers: {
        score: number;
      };
    };
  }>;
}
