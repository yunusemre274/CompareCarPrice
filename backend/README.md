# 🚗 Global Car Compare API Documentation

## Overview

A powerful REST API providing **real-time car price comparison** across global markets, integrated with live economic data, currency exchange rates, and purchasing power analytics.

**Base URL:** `http://localhost:5000`  
**Version:** 1.0.0  
**Response Format:** JSON  
**Rate Limit:** 100 requests per minute per IP

---

## 🚀 Quick Start

### Automated Data Jobs

- Nightly cron (02:00 server time) triggers `ingestCarCatalog` to pull the latest specs and prices into PostgreSQL.
- Jobs are registered automatically when the backend boots (`src/server.ts`).
- To force a manual refresh run `npm run seed`.

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file (or copy `.env.example`) and ensure you set at least:

```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/carcomparison
CORS_ORIGIN=http://localhost:8080
EXCHANGE_RATE_API_KEY=your_exchange_provider_key
MARKETCHECK_API_KEY=your_marketcheck_key
```

### Database & Prisma

```bash
# create the database + Prisma client
npx prisma migrate dev --name init
npx prisma generate
```

### Seed realistic data (brands, trims, prices)

```bash
npm run seed
```

The seed script calls the new ingestion pipeline, which fetches data from CarQuery/MarketCheck (or generates high-quality synthetic data if API keys are not present) and stores everything in PostgreSQL.

### Start Server

```bash
# Development mode (tsx + legacy Express server)
npm run dev

# Build + production
npm run build
npm start
```

The server will start at `http://localhost:5001`

---

## 📡 Endpoints

### 1. Car Price Comparison

**GET** `/api/car?name={car_name}`

Get comprehensive car pricing data across all countries with affordability metrics.

**Query Parameters:**
- `name` (required) - Car name (e.g., "Toyota Camry", "Tesla Model 3")

**Example Request:**
```
GET /api/car?name=Toyota%20Camry
```

**Example Response:**
```json
{
  "car": {
    "name": "Toyota Camry",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2024,
    "category": "Sedan",
    "base_price_usd": 28400,
    "image": "https://images.unsplash.com/photo-..."
  },
  "countries": [
    {
      "country_name": "United States",
      "country_code": "US",
      "flag": "https://flagcdn.com/us.svg",
      "flag_emoji": "🇺🇸",
      "taxed_price": {
        "value": 30388,
        "formatted_value_local": "$30,388",
        "formatted_usd": "$30,388",
        "formatted_currency_symbol": "$",
        "currency_code": "USD",
        "usd_value": 30388
      },
      "tax_free_price": {
        "value": 28400,
        "formatted_value_local": "$28,400",
        "formatted_usd": "$28,400",
        "formatted_currency_symbol": "$",
        "currency_code": "USD",
        "usd_value": 28400
      },
      "tax_rate_percentage": 7,
      "tax_amount": {
        "value": 1988,
        "formatted_value_local": "$1,988",
        "formatted_usd": "$1,988",
        "formatted_currency_symbol": "$",
        "currency_code": "USD",
        "usd_value": 1988
      },
      "minimum_wage": {
        "monthly": {
          "value": 2340,
          "formatted_value_local": "$2,340",
          "formatted_usd": "$2,340",
          "formatted_currency_symbol": "$",
          "currency_code": "USD",
          "usd_value": 2340
        },
        "yearly": { "..." },
        "weekly": { "..." },
        "hourly": { "..." }
      },
      "days_required": 390.2,
      "hours_required": 2251,
      "purchasing_power_score": 61.02,
      "equivalent_value": {
        "gold_equivalent": {
          "ounces": 14.82,
          "description": "14.82 oz of gold"
        },
        "real_estate_equivalent": {
          "percentage": 7.3,
          "description": "7.30% of average house price"
        },
        "electronics_equivalent": {
          "iphones": 30,
          "description": "30 iPhone 15 Pro"
        }
      },
      "local_currency": {
        "code": "USD",
        "name": "United States dollar",
        "symbol": "$",
        "usd_exchange_rate": 1.0000
      }
    }
  ],
  "total_countries": 30,
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "multiple_apis"
}
```

**Features:**
- ✅ Prices in local currency AND USD
- ✅ Tax breakdown (taxed vs tax-free)
- ✅ Minimum wage comparison
- ✅ Days/hours required to afford
- ✅ Purchasing power score
- ✅ Equivalent values (gold, real estate, electronics)
- ✅ Sorted by affordability

---

### 2. Car Search

**GET** `/api/car/search?q={query}`

Search available cars in the database.

**Query Parameters:**
- `q` (optional) - Search query (brand, model, category)

**Example Request:**
```
GET /api/car/search?q=BMW
```

**Example Response:**
```json
{
  "cars": [
    {
      "name": "BMW 3 Series",
      "brand": "BMW",
      "model": "3 Series",
      "year": 2024,
      "category": "Luxury Sedan",
      "base_price_usd": 43800,
      "image": "https://images.unsplash.com/photo-..."
    }
  ],
  "total": 1,
  "query": "BMW",
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "mock_database"
}
```

---

### 3. Smart Recommendations

**GET** `/api/recommendations?name={car_name}`

Get intelligent country recommendations based on multiple criteria.

**Query Parameters:**
- `name` (required) - Car name

**Example Request:**
```
GET /api/recommendations?name=Tesla%20Model%203
```

**Example Response:**
```json
{
  "car": {
    "name": "Tesla Model 3",
    "brand": "Tesla",
    "model": "Model 3",
    "base_price_usd": 38990
  },
  "recommendations": {
    "best_overall": {
      "title": "Best Overall Value",
      "description": "Best combination of price, affordability, and quality of life",
      "countries": [
        {
          "country_name": "Australia",
          "country_code": "AU",
          "flag": "https://flagcdn.com/au.svg",
          "overall_score": 87.5,
          "taxed_price_usd": 42889,
          "days_required": 40.3,
          "welfare_score": 8.8,
          "reason": "Best value with score 87.5/100"
        }
      ]
    },
    "most_affordable": {
      "title": "Most Affordable",
      "description": "Countries where you can buy this car fastest",
      "countries": [ "..." ]
    },
    "cheapest_tax_free": {
      "title": "Lowest Tax-Free Price",
      "description": "Countries with lowest base car price",
      "countries": [ "..." ]
    },
    "cheapest_total": {
      "title": "Lowest Total Price",
      "description": "Countries with lowest final price",
      "countries": [ "..." ]
    },
    "best_purchasing_power": {
      "title": "Strongest Purchasing Power",
      "description": "Countries with best wage-to-price ratio",
      "countries": [ "..." ]
    },
    "best_welfare": {
      "title": "Best Quality of Life",
      "description": "Countries with highest welfare scores",
      "countries": [ "..." ]
    },
    "lowest_tax": {
      "title": "Lowest Tax Rate",
      "description": "Countries with lowest automotive taxes",
      "countries": [ "..." ]
    }
  },
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "multiple_apis"
}
```

**Recommendation Categories:**
1. **Best Overall** - Weighted score combining all factors
2. **Most Affordable** - Fewest days of work required
3. **Cheapest Tax-Free** - Lowest base price
4. **Cheapest Total** - Lowest final price with taxes
5. **Best Purchasing Power** - Best wage-to-price ratio
6. **Best Welfare** - Highest quality of life
7. **Lowest Tax** - Lowest tax rates

---

### 4. Country Details

**GET** `/api/country/{countryCode}`

Get comprehensive country information including economy, government, and social data.

**Path Parameters:**
- `countryCode` (required) - ISO Alpha-2 code (e.g., "US", "GB", "DE")

**Example Request:**
```
GET /api/country/US
```

**Example Response:**
```json
{
  "country": {
    "name": "United States",
    "official_name": "United States of America",
    "alpha2": "US",
    "alpha3": "USA",
    "flag": "https://flagcdn.com/us.svg",
    "flag_emoji": "🇺🇸",
    "coat_of_arms": "https://...",
    "capital": "Washington, D.C.",
    "region": "Americas",
    "subregion": "North America",
    "continents": ["North America"],
    "independent": true,
    "un_member": true
  },
  "economy": {
    "gdp": 25400000000000,
    "gdp_per_capita": 76398,
    "gdp_growth_rate": 2.5,
    "inflation_rate": {
      "yearly": 3.4,
      "monthly": 0.28
    },
    "interest_rate": 5.5,
    "unemployment_rate": 3.7,
    "purchasing_power_index": 100,
    "welfare_score": 8.5
  },
  "government": {
    "president": "Joe Biden",
    "finance_minister": "Janet Yellen",
    "government_type": "Federal Presidential Republic"
  },
  "social": {
    "population": 331900000,
    "birth_rate": 11.4,
    "migration_rate": 3.03,
    "median_age": 38.5,
    "education_index": 0.9,
    "life_expectancy": 78.9
  },
  "minimum_wage": {
    "monthly": { "..." },
    "yearly": { "..." },
    "weekly": { "..." },
    "hourly": { "..." }
  },
  "currency": {
    "code": "USD",
    "name": "United States dollar",
    "symbol": "$",
    "usd_exchange_rate": 1.0000,
    "change_24h_percentage": 0,
    "trend_30_days": [
      { "date": "2025-10-15", "rate": 1.0000 },
      { "date": "2025-10-16", "rate": 1.0000 }
    ],
    "trend_90_days": [ "..." ]
  },
  "geography": {
    "area": 9372610,
    "latitude": 38.0,
    "longitude": -97.0,
    "landlocked": false,
    "borders": ["CAN", "MEX"],
    "timezones": ["UTC-12:00", "UTC-11:00", "..."]
  },
  "languages": ["English"],
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "multiple_apis"
}
```

**Data Categories:**
- 🌍 **Country** - Basic info, flag, capital
- 💰 **Economy** - GDP, inflation, interest rates, welfare
- 🏛️ **Government** - Leaders, government type
- 👥 **Social** - Population, birth rate, education
- 💵 **Minimum Wage** - Monthly, yearly, weekly, hourly
- 💱 **Currency** - Exchange rates, trends
- 📍 **Geography** - Area, borders, timezones
- 🗣️ **Languages** - Official languages

---

### 5. Countries List

**GET** `/api/countries`

Get all countries for dropdown/select menus.

**Example Request:**
```
GET /api/countries
```

**Example Response:**
```json
{
  "countries": [
    {
      "name": "Afghanistan",
      "official_name": "Islamic Republic of Afghanistan",
      "alpha2": "AF",
      "alpha3": "AFG",
      "flag": "https://flagcdn.com/af.svg",
      "flag_emoji": "🇦🇫",
      "currency": "AFN",
      "currency_name": "Afghan afghani",
      "currency_symbol": "؋",
      "region": "Asia",
      "subregion": "Southern Asia",
      "population": 40218234,
      "capital": "Kabul",
      "languages": ["Pashto", "Dari"],
      "timezones": ["UTC+04:30"]
    }
  ],
  "total": 250,
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "restcountries.com"
}
```

---

### 6. Currency Exchange

**GET** `/api/exchange?from={USD}&to={EUR}&amount={100}`

Convert currency with real-time exchange rates.

**Query Parameters:**
- `from` (required) - Source currency code (e.g., "USD")
- `to` (required) - Target currency code (e.g., "EUR")
- `amount` (optional) - Amount to convert (default: 1)

**Example Request:**
```
GET /api/exchange?from=USD&to=EUR&amount=100
```

**Example Response:**
```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "result": 92.45,
  "rate": 0.9245,
  "change_24h_percentage": -0.15,
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "exchangerate.host"
}
```

---

### 7. Exchange Rates

**GET** `/api/exchange/rates`

Get all current exchange rates (USD as base currency).

**Example Request:**
```
GET /api/exchange/rates
```

**Example Response:**
```json
{
  "base": "USD",
  "date": "2025-11-14",
  "rates": {
    "AED": 3.6725,
    "AFN": 68.5,
    "ALL": 92.5,
    "AMD": 387.0,
    "EUR": 0.9245,
    "GBP": 0.7856,
    "JPY": 149.85,
    "CNY": 7.24,
    "...": "..."
  },
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "exchangerate.host"
}
```

---

### 8. Exchange Rate History

**GET** `/api/exchange/history?base={USD}&symbol={EUR}&days={30}`

Get historical exchange rate data for currency trends.

**Query Parameters:**
- `base` (required) - Base currency code (e.g., "USD")
- `symbol` (required) - Target currency code (e.g., "EUR")
- `days` (optional) - Number of days (default: 30, max: 365)

**Example Request:**
```
GET /api/exchange/history?base=USD&symbol=EUR&days=90
```

**Example Response:**
```json
{
  "base": "USD",
  "symbol": "EUR",
  "period_days": 90,
  "trend": [
    { "date": "2025-08-15", "rate": 0.9180 },
    { "date": "2025-08-16", "rate": 0.9195 },
    { "date": "2025-08-17", "rate": 0.9210 },
    { "..." }
  ],
  "last_updated": "2025-11-14T10:30:00.000Z",
  "source": "exchangerate.host"
}
```

---

## 🎯 Key Features

### ✅ Real-Time Data
All data comes from live external APIs:
- **Currency:** exchangerate.host (free, no key required)
- **Countries:** restcountries.com (free, no key required)
- **Economic Data:** World Bank API (free, no key required)
- **Car Prices:** Mock data (easily replaceable with real API)

### ✅ Smart Caching
- Responses cached for 10-15 minutes
- Reduces API calls and improves performance
- Automatic fallback to stale cache if API fails
- In-memory caching with NodeCache

### ✅ Rate Limiting
- 100 requests per minute per IP address
- Prevents abuse and ensures fair usage
- Returns 429 status with retry-after header

### ✅ Error Handling
- Unified error response format
- Graceful degradation (returns cached data if API fails)
- Always returns usable data (mock fallback if needed)
- Development mode includes stack traces

### ✅ Performance
- Response time < 400ms (with caching)
- Parallel API calls where possible
- Compression enabled
- Optimized data structures

### ✅ Currency Formatting
All monetary values returned in structured format:
```json
{
  "value": 30388,
  "formatted_value_local": "$30,388",
  "formatted_usd": "$30,388",
  "formatted_currency_symbol": "$",
  "currency_code": "USD",
  "usd_value": 30388
}
```

### ✅ Sorting Keys
All comparison endpoints include numeric keys for easy frontend sorting:
- `purchasing_power_score` - Higher is better
- `days_required` - Lower is better
- `overall_score` - Higher is better
- `welfare_score` - Higher is better

---

## 🔒 Error Responses

All errors follow this format:

```json
{
  "error": true,
  "message": "Car 'Invalid Car' not found in database",
  "status": 404
}
```

**Common Status Codes:**
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (car or country not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (external API failure)

---

## 📊 Available Mock Cars

The following cars are available in the mock database:

1. **Toyota Camry** - $28,400 (Sedan)
2. **Honda Civic** - $24,650 (Sedan)
3. **Ford F-150** - $36,575 (Truck)
4. **Tesla Model 3** - $38,990 (Electric)
5. **BMW 3 Series** - $43,800 (Luxury Sedan)
6. **Mercedes-Benz C-Class** - $44,600 (Luxury Sedan)
7. **Volkswagen Golf** - $30,050 (Hatchback)
8. **Audi A4** - $40,500 (Luxury Sedan)
9. **Hyundai Elantra** - $21,900 (Sedan)
10. **Mazda CX-5** - $29,200 (SUV)

---

## 🛠️ Replacing Mock Data

### Car Price Service

Replace `backend/services/carService.js` with real API integration:

```javascript
// Example integration with real car price API
export const getCarPriceForCountry = async (carName, countryCode) => {
  const response = await fetch(`https://your-car-api.com/prices`, {
    method: 'POST',
    body: JSON.stringify({ car: carName, country: countryCode })
  });
  
  const data = await response.json();
  
  return {
    car_name: data.name,
    country_code: countryCode,
    base_price_usd: data.base_price,
    tax_rate_percentage: data.tax_rate,
    taxed_price_usd: data.final_price,
    tax_free_price_usd: data.base_price,
    last_updated: new Date().toISOString(),
    source: 'real_car_api'
  };
};
```

---

## 🚀 Deployment

### Environment Variables

For production, update these variables:

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
CACHE_TTL_SECONDS=900
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Hosting

**Recommended platforms:**
- **Heroku** - Easy deployment, free tier available
- **Railway** - Modern, fast deployment
- **Render** - Automatic deployments from GitHub
- **DigitalOcean App Platform** - Scalable, reliable
- **AWS Elastic Beanstalk** - Enterprise-grade

### Example: Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## 📈 Performance Tips

1. **Enable Redis** for production caching (replace NodeCache)
2. **Use CDN** for static assets
3. **Enable HTTP/2** for parallel requests
4. **Implement pagination** for large datasets
5. **Add database** for car prices instead of in-memory mock
6. **Setup monitoring** (e.g., New Relic, Datadog)

---

## 🧪 Testing

### Test Endpoints

```bash
# Health check
curl http://localhost:5000/

# Get car comparison
curl "http://localhost:5000/api/car?name=Toyota%20Camry"

# Get recommendations
curl "http://localhost:5000/api/recommendations?name=Tesla%20Model%203"

# Get country details
curl http://localhost:5000/api/country/US

# Currency conversion
curl "http://localhost:5000/api/exchange?from=USD&to=EUR&amount=100"
```

---

## 🤝 Support

For issues or questions:
1. Check API documentation at `/api/docs`
2. Review this README
3. Check server logs for errors
4. Verify external APIs are accessible

---

## 📝 License

MIT License - Free to use and modify

---

**Built with ❤️ for Global Car Compare**
