import express from 'express';
import * as exchangeController from '../controllers/exchangeController.js';

const router = express.Router();

// GET /api/exchange?from={USD}&to={EUR}&amount={100}
// Convert currency with real-time rates
router.get('/', exchangeController.convertCurrency);

// GET /api/exchange/rates
// Get all exchange rates (USD base)
router.get('/rates', exchangeController.getExchangeRates);

// GET /api/exchange/history?base={USD}&symbol={EUR}&days={30}
// Get historical exchange rates
router.get('/history', exchangeController.getHistoricalRates);

export default router;
