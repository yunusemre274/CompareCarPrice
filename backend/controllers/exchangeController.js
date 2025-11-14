import * as currencyService from '../services/currencyService.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * GET /api/exchange?from={USD}&to={EUR}&amount={100}
 * Convert currency with real-time rates
 */
export const convertCurrency = asyncHandler(async (req, res) => {
  const { from, to, amount } = req.query;
  
  // Validation
  if (!from || !to) {
    return res.status(400).json({
      error: true,
      message: 'Both "from" and "to" currency codes are required',
      status: 400
    });
  }
  
  const amountValue = parseFloat(amount) || 1;
  
  if (amountValue <= 0) {
    return res.status(400).json({
      error: true,
      message: 'Amount must be greater than 0',
      status: 400
    });
  }
  
  // Get conversion
  const conversion = await currencyService.convertCurrency(
    from.toUpperCase(),
    to.toUpperCase(),
    amountValue
  );
  
  // Get 24-hour change
  const change24h = await currencyService.get24HourChange(from, to);
  
  res.json({
    from: conversion.from,
    to: conversion.to,
    amount: conversion.amount,
    result: conversion.result,
    rate: conversion.rate,
    change_24h_percentage: change24h.change_24h,
    last_updated: conversion.last_updated,
    source: conversion.source
  });
});

/**
 * GET /api/exchange/rates
 * Get all exchange rates (USD base)
 */
export const getExchangeRates = asyncHandler(async (req, res) => {
  const rates = await currencyService.getExchangeRates();
  res.json(rates);
});

/**
 * GET /api/exchange/history?base={USD}&symbol={EUR}&days={30}
 * Get historical exchange rates
 */
export const getHistoricalRates = asyncHandler(async (req, res) => {
  const { base, symbol, days } = req.query;
  
  if (!base || !symbol) {
    return res.status(400).json({
      error: true,
      message: 'Both "base" and "symbol" currency codes are required',
      status: 400
    });
  }
  
  const daysValue = parseInt(days) || 30;
  
  if (daysValue < 1 || daysValue > 365) {
    return res.status(400).json({
      error: true,
      message: 'Days must be between 1 and 365',
      status: 400
    });
  }
  
  const history = await currencyService.getHistoricalRates(
    base.toUpperCase(),
    symbol.toUpperCase(),
    daysValue
  );
  
  res.json(history);
});

export default {
  convertCurrency,
  getExchangeRates,
  getHistoricalRates
};
