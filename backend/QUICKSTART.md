# 🚀 Quick Start Guide

## Installation

```bash
cd backend
npm install
```

## Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run at: `http://localhost:5000`

## Test the API

Open your browser or use curl:

### 1. Health Check
```
http://localhost:5000/
```

### 2. Get Car Prices
```
http://localhost:5000/api/car?name=Toyota Camry
```

### 3. Get Recommendations
```
http://localhost:5000/api/recommendations?name=Tesla Model 3
```

### 4. Get Country Info
```
http://localhost:5000/api/country/US
```

### 5. Currency Exchange
```
http://localhost:5000/api/exchange?from=USD&to=EUR&amount=100
```

### 6. View Documentation
```
http://localhost:5000/api/docs
```

## Available Mock Cars

Try these car names:
- Toyota Camry
- Honda Civic
- Tesla Model 3
- BMW 3 Series
- Mercedes C-Class
- Ford F-150
- Volkswagen Golf
- Audi A4
- Hyundai Elantra
- Mazda CX-5

## Common Country Codes

- US - United States
- GB - United Kingdom
- DE - Germany
- FR - France
- JP - Japan
- CN - China
- IN - India
- BR - Brazil
- TR - Turkey
- AU - Australia

## Features

✅ Real-time currency exchange rates
✅ Global economic data (GDP, inflation, etc.)
✅ Car price comparison across 30+ countries
✅ Purchasing power calculations
✅ Smart recommendations
✅ Response caching (10-15 minutes)
✅ Rate limiting (100 requests/minute)
✅ Automatic error handling with fallbacks

## Next Steps

1. **Frontend Integration**: Use these endpoints in your React/Vue app
2. **Replace Mock Data**: Update `services/carService.js` with real car price API
3. **Customize Countries**: Modify the country list in `controllers/carController.js`
4. **Add Features**: Extend with more endpoints as needed

## Need Help?

- Full API documentation: `http://localhost:5000/api/docs`
- Detailed README: `backend/README.md`
- Check server console for logs and errors
