# 🎯 SpotFly - Getting Started (Start Here!)

## Welcome to SpotFly! 👋

This is a complete flight search engine built with Next.js, TypeScript, and the Amadeus API. This guide will get you running in **5 minutes**.

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get API Credentials (2 minutes)

1. Go to **https://developers.amadeus.com/**
2. Click "**Register**" (or "Sign In" if you have an account)
3. Once logged in, click "**My Self-Service Workspace**"
4. Click "**Create New App**"
5. Name it anything (e.g., "SpotFly Test")
6. Copy your **API Key** and **API Secret**

### Step 2: Configure Environment (1 minute)

Create a file named `.env.local` in the project root:

```bash
AMADEUS_API_KEY=paste_your_api_key_here
AMADEUS_API_SECRET=paste_your_api_secret_here
```

💡 **Tip**: There's a `.env.local.example` file you can copy:

```bash
cp .env.local.example .env.local
# Then edit .env.local with your credentials
```

### Step 3: Install & Run (2 minutes)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open **http://localhost:3000** in your browser. Done! 🎉

---

## 🧪 Try Your First Search

Use this example to test:

1. **From**: Type "New York" → Select "JFK"
2. **To**: Type "Los Angeles" → Select "LAX"
3. **Departure Date**: Pick tomorrow's date
4. **Trip Type**: One Way
5. **Passengers**: 1 Adult
6. **Class**: Economy
7. Click **"Search Flights"**

You should see:

- ✅ List of flights
- ✅ Price graph at the top
- ✅ Filters on the left

---

## 🎨 Explore the Features

### 1. Try the Filters

After searching:

- **Price Slider**: Drag to filter by price range
- **Stops**: Check "Nonstop" to see only direct flights
- **Airlines**: Select specific airlines

👀 **Watch**: The price graph updates in real-time!

### 2. Try Different Routes

Popular test routes that usually have data:

- JFK (New York) ↔ LAX (Los Angeles)
- LHR (London) ↔ CDG (Paris)
- SFO (San Francisco) ↔ SEA (Seattle)
- ORD (Chicago) ↔ MIA (Miami)

### 3. Mobile View

Resize your browser or open on mobile - it's fully responsive!

---

## 📚 Documentation Files

We have comprehensive docs:

| File                   | Purpose                      |
| ---------------------- | ---------------------------- |
| **README.md**          | Full technical documentation |
| **QUICKSTART.md**      | Detailed 5-minute guide      |
| **FEATURES.md**        | Complete feature breakdown   |
| **DEPLOYMENT.md**      | How to deploy to production  |
| **PROJECT_SUMMARY.md** | Complete project overview    |
| **This file**          | Quick start guide            |

---

## ❓ Common Issues

### "No flights found"

**Solution**:

- Try popular routes (JFK-LAX, LHR-CDG)
- Use dates within the next 6 months
- The test API has limited data

### "Failed to search flights"

**Solution**:

- Check your `.env.local` file exists
- Verify API credentials are correct
- The test API has rate limits - wait a minute

### Location search not working

**Solution**:

- Type at least 2 characters
- Wait for autocomplete to appear
- Try airport codes (JFK, LAX) or city names

### Build errors

**Solution**:

```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm dev
```

---

## 🏗️ Project Structure

```
spotfly/
├── app/                    # Next.js app
│   ├── api/flights/       # API routes
│   ├── page.tsx           # Main page
│   └── layout.tsx         # Root layout
│
├── components/
│   ├── flight/            # Flight components
│   └── ui/                # UI components
│
├── lib/                   # Utilities & services
├── types/                 # TypeScript types
└── Documentation files
```

---

## 🎯 What You Can Do

### ✅ Implemented Features

1. **Search Flights**
   - One-way and round-trip
   - Multiple passengers
   - Different cabin classes
   - Smart autocomplete

2. **View Results**
   - Detailed flight cards
   - Prices and times
   - Airline information
   - Stop details

3. **Price Graph**
   - Visual price trends
   - Min, max, average prices
   - Interactive tooltips
   - Real-time updates

4. **Advanced Filters**
   - Price range slider
   - Number of stops
   - Multiple airlines
   - Instant filtering

5. **Responsive Design**
   - Mobile optimized
   - Tablet friendly
   - Desktop enhanced

---

## 🛠️ Tech Stack

**Frontend:**

- Next.js 16 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- shadcn/ui (components)
- Recharts (graphs)

**Backend:**

- Next.js API routes
- Amadeus API integration
- TanStack Query (caching)

---

## 📖 Next Steps

1. ✅ **Test the app** - Try different searches
2. 📖 **Read README.md** - For technical details
3. 🎨 **Customize** - Modify colors, add features
4. 🚀 **Deploy** - See DEPLOYMENT.md

---

## 🎓 Learning Resources

Want to understand the code better?

### Key Files to Read:

1. `app/page.tsx` - Main application logic
2. `components/flight/flight-search-form.tsx` - Search interface
3. `components/flight/flight-filters.tsx` - Filtering logic
4. `lib/flight-service.ts` - Business logic

### Concepts Used:

- React Hooks (useState, useMemo, useCallback)
- TanStack Query for data fetching
- Client-side filtering
- TypeScript for type safety
- Recharts for data visualization

---

## 💡 Tips

### Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Check code quality
```

### Environment Variables

- Never commit `.env.local` to git
- Use `.env.local.example` for documentation
- Different envs for dev/staging/prod

### Code Quality

- All files use TypeScript
- Components are modular
- Services handle business logic
- Types are in separate files

---

## 🤝 Need Help?

1. **Check the docs** - We have 5 documentation files
2. **Read the code** - It's well-commented
3. **Check browser console** - Error messages are helpful
4. **Verify API credentials** - Most common issue

---

## 🎉 You're Ready!

You now have a fully functional flight search engine. Here's what to try:

1. ✈️ Search for flights
2. 📊 See the price graph
3. 🔍 Use the filters
4. 📱 Test on mobile
5. 🎨 Explore the code
6. 🚀 Deploy to production

**Happy coding!** 🚀

---

**Quick Links:**

- API Docs: https://developers.amadeus.com/
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/
- shadcn/ui: https://ui.shadcn.com/

---

Made with ❤️ for Spotter AI Technical Assessment
