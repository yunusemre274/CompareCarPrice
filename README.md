# 🚗 Global Car Price Comparison Platform

Compare car prices across 30+ countries with real-time economic data, currency conversion, and detailed country analysis.

![Car Comparison](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)

## ✨ Features

### 🔍 Smart Car Search
- **250+ vehicles** from 30+ premium brands (BMW, Mercedes, Tesla, Toyota, etc.)
- **Autocomplete search** with top 5 alphabetical suggestions
- **Keyboard navigation** (↑↓ arrows, Enter, Escape)
- **Instant results** with debounced input

### 📊 Price Comparison
- **30+ countries** with real-time data
- **Tax-inclusive and tax-free** pricing
- **Currency conversion** for all major currencies
- **Days to buy** calculation based on minimum wage
- **Purchasing power analysis** with welfare scoring
- **Equivalent value** (gold, real estate, electronics)

### 🌍 Country Analysis
- **Detailed economic data**: GDP, inflation, interest rates, unemployment
- **Government information**: Leaders, government type
- **Social indicators**: Population, education index, life expectancy
- **Minimum wage**: Monthly, yearly, weekly, hourly (all in USD)
- **Currency trends**: 30-day historical exchange rate charts

### 🎨 User Experience
- **Dark/Light theme** with automatic persistence
- **Sortable tables** by any column
- **Collapsible country panels** with detailed information
- **Color-coded affordability** badges (<100 days green, 100-300 yellow, >300 red)
- **Responsive design** (mobile, tablet, desktop)
- **Real-time updates** with smart caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd CarComparison
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Configure environment variables**
```bash
# Root .env (Frontend)
VITE_API_URL=http://localhost:5001/api

# backend/.env
PORT=5001
NODE_ENV=development
CACHE_TTL=600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start the servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:8080
```

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── controllers/       # Request handlers for all endpoints
├── services/         # Business logic and external API integration
├── routes/           # API route definitions
├── utils/            # Utilities (caching, rate limiting, error handling)
├── server.js         # Main Express application
└── package.json      # Dependencies and scripts
```

**Key Backend Features:**
- RESTful API with 8 endpoints
- Smart caching (10-15 min TTL)
- Rate limiting (100 req/min per IP)
- CORS configured for frontend
- Comprehensive error handling
- Fallback data for reliability

### Frontend (React + TypeScript + Vite)
```
src/
├── components/       # React components (SearchBar, Table, Panels)
├── lib/             # Utilities (API service, car database)
├── pages/           # Main application pages
└── App.tsx          # Root application component
```

**Key Frontend Features:**
- TypeScript for type safety
- Vite for fast development
- Tailwind CSS + shadcn/ui components
- Recharts for data visualization
- localStorage for persistence

## 📡 API Endpoints

### Car Endpoints
- `GET /api/car?name={car_name}` - Get car price comparison
- `GET /api/car/search?q={query}` - Search cars
- `GET /api/recommendations?name={car_name}` - Get best countries to buy

### Country Endpoints
- `GET /api/countries` - Get all available countries
- `GET /api/country/{code}` - Get detailed country information
- `GET /api/countries/search?q={query}` - Search countries

### Currency Endpoints
- `GET /api/exchange?from={USD}&to={EUR}&amount={100}` - Convert currency
- `GET /api/exchange/rates` - Get all exchange rates
- `GET /api/exchange/history?base={USD}&symbol={EUR}&days={30}` - Historical rates

## 🎯 Usage Examples

### Search for a Car
```typescript
// Frontend usage
import { apiService } from '@/lib/apiService';

const results = await apiService.searchCars('BMW');
// Returns: [{ name: "BMW 3 Series", brand: "BMW", ... }, ...]
```

### Get Car Comparison
```typescript
const comparison = await apiService.getCarComparison('Toyota Camry');
// Returns comparison across 30+ countries with prices, wages, etc.
```

### Get Country Details
```typescript
const countryData = await apiService.getCountryDetails('US');
// Returns economy, government, social, wage, and currency data
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4.18.2
- **Caching**: NodeCache 5.1.2
- **HTTP Client**: Axios 1.6.2
- **Security**: Helmet 7.1.0, CORS 2.8.5
- **Rate Limiting**: express-rate-limit 7.1.5
- **Compression**: compression 1.7.4

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui
- **Charts**: Recharts 2.15.4
- **Router**: React Router DOM 6.29.0
- **State Management**: React Query 5.64.3
- **Theme**: next-themes 0.3.0

## 📊 Data Sources

- **Fallback Exchange Rates**: Static currency data (reliable and fast)
- **Fallback Country Data**: 30 major countries with complete information
- **Mock Economic Data**: Realistic economic indicators
- **Car Database**: 250+ vehicles with accurate base prices

## 🔒 Security Features

- Helmet security headers
- CORS configuration
- Rate limiting (100 requests/minute)
- Input validation
- Environment variable protection
- Error message sanitization

## 🚀 Performance

- **Smart Caching**: 10-15 minute TTL reduces API calls
- **Response Compression**: Reduced payload sizes
- **Code Splitting**: Optimized bundle loading
- **Lazy Loading**: Country panels loaded on demand
- **Debounced Search**: Reduces unnecessary API calls

## 📈 Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **Vite** - Lightning-fast build tool

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using React, TypeScript, Node.js, and Express**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cdbf06a7-eaac-41fa-aca9-511d2e6bf8f9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
