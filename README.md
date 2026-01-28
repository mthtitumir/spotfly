# SpotFly - Flight Search Engine

A modern, responsive flight search engine built with Next.js, featuring real-time price graphs, complex filtering, and integration with the Amadeus Self-Service API.

## 🚀 Features

- **Comprehensive Flight Search**: Search for one-way and round-trip flights with flexible date selection
- **Location Autocomplete**: Smart airport and city search with real-time suggestions
- **Live Price Graph**: Visual price trends using Recharts that updates in real-time with filters
- **Complex Filtering System**:
  - Filter by price range
  - Filter by number of stops (nonstop, 1 stop, 2+ stops)
  - Filter by airlines
  - All filters update both flight list and price graph instantly
- **Responsive Design**: Fully functional on mobile, tablet, and desktop
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Data Caching**: Efficient caching with TanStack Query

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **State Management**: TanStack Query + Zustand
- **API**: Amadeus Self-Service API (Test environment)
- **Date Handling**: date-fns
- **Form Validation**: React Hook Form + Zod
- **Icons**: React Icons

## 📋 Prerequisites

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- Amadeus API credentials (free test account)

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd spotfly
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Get Amadeus API Credentials

1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a free account
3. Create a new app in the Self-Service dashboard
4. Copy your API Key and API Secret

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Amadeus credentials:

```env
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Searching for Flights

1. **Select Trip Type**: Choose between Round Trip or One Way
2. **Enter Origin**: Type to search for departure airport/city
3. **Enter Destination**: Type to search for arrival airport/city
4. **Select Dates**: Choose departure date (and return date for round trips)
5. **Configure Passengers**: Select number of adults
6. **Choose Class**: Select Economy, Premium Economy, Business, or First Class
7. **Click Search**: View results with price graph and filters

### Using Filters

The filter sidebar allows you to:

- **Adjust Price Range**: Use the slider to set min/max price
- **Filter by Stops**: Select nonstop, 1 stop, or 2+ stops
- **Filter by Airlines**: Check/uncheck airlines to include/exclude

All filters update the flight list and price graph **instantly** without new API calls.

## 🏗️ Project Structure

```
spotfly/
├── app/
│   ├── api/
│   │   └── flights/
│   │       ├── locations/       # Location search endpoint
│   │       └── search/          # Flight search endpoint
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Main search page
│   └── providers.tsx            # TanStack Query provider
├── components/
│   ├── flight/
│   │   ├── flight-card.tsx      # Individual flight display
│   │   ├── flight-filters.tsx   # Filter sidebar
│   │   ├── flight-search-form.tsx # Search form
│   │   ├── location-search.tsx  # Airport autocomplete
│   │   └── price-graph.tsx      # Recharts price visualization
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── axios-instance.ts        # Axios configuration
│   ├── flight-service.ts        # Flight API service
│   └── utils.ts                 # Utility functions
├── types/
│   └── flight.ts                # TypeScript types/interfaces
└── hooks/                       # Custom React hooks
```

## 🎨 Key Components

### FlightSearchForm

Full-featured search form with:

- Location autocomplete with debounced API calls
- Date pickers with validation
- Trip type toggle (one-way/round-trip)
- Passenger and class selection

### PriceGraph

Interactive price trend chart that:

- Shows average, min, and max prices
- Updates in real-time as filters change
- Displays flight counts per price point
- Responsive and touch-friendly

### FlightFilters

Comprehensive filtering with:

- Price range slider
- Stop count checkboxes
- Airline selection
- Clear all filters button
- Live update of results

### FlightCard

Detailed flight information showing:

- Airline and flight number
- Departure/arrival times and airports
- Duration and stops
- Price with currency
- Cabin class and seat availability

## 🔌 API Integration

The app uses the Amadeus Self-Service API (Test environment) with two main endpoints:

### Location Search

```
GET /api/flights/locations?keyword={query}
```

Returns airports and cities matching the search query.

### Flight Search

```
GET /api/flights/search?originLocationCode={origin}&destinationLocationCode={dest}&departureDate={date}&...
```

Returns available flight offers with pricing and itinerary details.

## 🚀 Performance Optimizations

- **Request Debouncing**: Location searches debounced to 300ms
- **Query Caching**: TanStack Query caches flight searches for 5 minutes
- **Memoization**: useMemo hooks prevent unnecessary recalculations
- **Client-side Filtering**: Filters applied without new API calls
- **Lazy Loading**: Components loaded as needed

## 🎯 Future Enhancements

- [ ] Multi-city flight search
- [ ] Flexible date search (± 3 days)
- [ ] Flight booking integration
- [ ] Price alerts and tracking
- [ ] User accounts and saved searches
- [ ] Comparison with multiple airlines
- [ ] Baggage information display
- [ ] Seat map visualization

## 📄 License

This project is built as a technical assessment for Spotter AI.

## 🙏 Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com/) for the flight API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library

---

Built with ❤️ using Next.js and TypeScript
