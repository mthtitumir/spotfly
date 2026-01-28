# Quick Start Guide - SpotFly

## Immediate Setup (5 minutes)

### 1. Get Amadeus API Credentials

1. Visit https://developers.amadeus.com/
2. Click "Register" or "Sign In"
3. Once logged in, go to "My Self-Service Workspace"
4. Click "Create New App"
5. Name it "SpotFly Test"
6. Copy your **API Key** and **API Secret**

### 2. Configure the App

Create `.env.local` in the project root:

```bash
AMADEUS_API_KEY=paste_your_key_here
AMADEUS_API_SECRET=paste_your_secret_here
```

### 3. Install & Run

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000

## First Search

Try this example search:

- **From**: JFK (New York)
- **To**: LAX (Los Angeles)
- **Departure**: Tomorrow's date
- **Trip Type**: One Way
- **Passengers**: 1 Adult
- **Class**: Economy

Click "Search Flights" and you'll see:
✅ List of available flights
✅ Live price graph showing trends
✅ Filter sidebar (price, stops, airlines)

## Testing Filters

After getting results:

1. **Price Filter**: Drag the price slider - results update instantly
2. **Stops Filter**: Check "Nonstop" - only direct flights show
3. **Airline Filter**: Select specific airlines to compare

Watch the price graph update in real-time as you apply filters!

## Common Issues

### No flights found?

- Try popular routes: JFK↔LAX, LHR↔CDG, SFO↔SEA
- Use dates within next 6 months
- The test API has limited inventory

### API errors?

- Check your `.env.local` file exists and has correct credentials
- Amadeus test API has rate limits (free tier)
- Wait a minute and try again

### Location search not working?

- Type at least 2 characters
- Use airport codes (JFK, LAX) or city names (London, Paris)
- Results appear after 300ms

## Features to Explore

### Search Form

- ✈️ Smart location autocomplete
- 📅 Date validation (can't pick past dates)
- 🔄 Swap origin/destination button
- 🎫 Multiple cabin classes

### Results View

- 📊 Interactive price graph with hover details
- 💺 Flight details: times, stops, duration
- 🏷️ Seat availability warnings
- 💰 Price per person display

### Filtering

- 🎚️ Dual-handle price slider
- ⛔ Stop count filters
- ✈️ Airline selection
- 🔄 Clear all filters button

## Development Notes

### API Limitations (Test Environment)

- Limited flight inventory
- Rate limited to ~10 requests/minute
- Some routes may have no data
- Best results with major airports

### Performance

- Searches cached for 5 minutes
- Filters work client-side (no new API calls)
- Location searches debounced to 300ms

### Responsive Design

- Mobile: Stacked layout, collapsible filters
- Tablet: Partial sidebar
- Desktop: Full sidebar + main content

## Need Help?

Check the main README.md for:

- Full feature documentation
- Architecture details
- API integration guide
- Component breakdown

---

🚀 Happy Testing! If you encounter issues, check your browser console for detailed error messages.
