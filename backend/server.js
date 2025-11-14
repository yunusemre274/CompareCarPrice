import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Import routes
import carRoutes from './routes/carRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

// Import middleware
import { limiter } from './utils/rateLimiter.js';
import { errorHandler, notFound } from './utils/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// ============= MIDDLEWARE =============

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS for frontend
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'];

// Add Vercel preview and production domains
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches *.vercel.app pattern
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compress responses
app.use(compression());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', limiter);

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============= ROUTES =============

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Global Car Compare API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      car: '/api/car?name={car_name}',
      car_search: '/api/car/search?q={query}',
      recommendations: '/api/recommendations?name={car_name}',
      country: '/api/country/{country_code}',
      countries: '/api/countries',
      exchange: '/api/exchange?from={USD}&to={EUR}',
      exchange_rates: '/api/exchange/rates',
      exchange_history: '/api/exchange/history?base={USD}&symbol={EUR}&days={30}'
    },
    documentation: '/api/docs'
  });
});

// API Routes
app.use('/api/car', carRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/recommendations', recommendationRoutes);

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Global Car Compare API Documentation',
    version: '1.0.0',
    description: 'Real-time car price comparison with global economic data',
    base_url: `http://localhost:${PORT}`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/car',
        description: 'Get car prices across all countries',
        query_params: {
          name: 'Car name (required) - e.g., "Toyota Camry"'
        },
        example: '/api/car?name=Toyota%20Camry'
      },
      {
        method: 'GET',
        path: '/api/car/search',
        description: 'Search for available cars',
        query_params: {
          q: 'Search query (optional) - e.g., "BMW"'
        },
        example: '/api/car/search?q=BMW'
      },
      {
        method: 'GET',
        path: '/api/recommendations',
        description: 'Get best country recommendations for buying a car',
        query_params: {
          name: 'Car name (required) - e.g., "Tesla Model 3"'
        },
        example: '/api/recommendations?name=Tesla%20Model%203'
      },
      {
        method: 'GET',
        path: '/api/country/:countryCode',
        description: 'Get detailed country information',
        path_params: {
          countryCode: 'ISO Alpha-2 country code - e.g., "US", "GB", "DE"'
        },
        example: '/api/country/US'
      },
      {
        method: 'GET',
        path: '/api/countries',
        description: 'Get all countries for dropdown',
        example: '/api/countries'
      },
      {
        method: 'GET',
        path: '/api/exchange',
        description: 'Convert currency with real-time rates',
        query_params: {
          from: 'Source currency code (required) - e.g., "USD"',
          to: 'Target currency code (required) - e.g., "EUR"',
          amount: 'Amount to convert (optional, default: 1)'
        },
        example: '/api/exchange?from=USD&to=EUR&amount=100'
      },
      {
        method: 'GET',
        path: '/api/exchange/rates',
        description: 'Get all exchange rates (USD base)',
        example: '/api/exchange/rates'
      },
      {
        method: 'GET',
        path: '/api/exchange/history',
        description: 'Get historical exchange rates',
        query_params: {
          base: 'Base currency (required) - e.g., "USD"',
          symbol: 'Target currency (required) - e.g., "EUR"',
          days: 'Number of days (optional, default: 30, max: 365)'
        },
        example: '/api/exchange/history?base=USD&symbol=EUR&days=90'
      }
    ],
    features: [
      'Real-time exchange rates',
      'Global country economic data',
      'Car price comparison across countries',
      'Purchasing power calculations',
      'Smart recommendations',
      'Response caching (10-15 minutes)',
      'Rate limiting (100 req/min)',
      'Error handling with fallbacks'
    ],
    data_sources: [
      'exchangerate.host - Currency rates',
      'restcountries.com - Country data',
      'World Bank API - Economic indicators',
      'Mock data - Car prices (replaceable)'
    ]
  });
});

// ============= ERROR HANDLING =============

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============= START SERVER =============

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚗 Global Car Compare API Server       ║
║                                            ║
║   Status: ✅ ONLINE                        ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   API Docs: http://localhost:${PORT}/api/docs  ║
╚════════════════════════════════════════════╝
  `);
  
  console.log('\n📡 Available Endpoints:');
  console.log(`   GET  /api/car?name={car_name}`);
  console.log(`   GET  /api/car/search?q={query}`);
  console.log(`   GET  /api/recommendations?name={car_name}`);
  console.log(`   GET  /api/country/{code}`);
  console.log(`   GET  /api/countries`);
  console.log(`   GET  /api/exchange?from={USD}&to={EUR}`);
  console.log(`   GET  /api/exchange/rates`);
  console.log(`   GET  /api/exchange/history`);
  
  console.log('\n🎯 Features:');
  console.log('   ✓ Real-time currency exchange');
  console.log('   ✓ Global economic data');
  console.log('   ✓ Smart caching (10-15 min)');
  console.log('   ✓ Rate limiting (100/min)');
  console.log('   ✓ Comprehensive error handling');
  console.log('\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;
