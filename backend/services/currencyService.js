import { fetchWithCache } from '../utils/apiFetcher.js';

const RATE_CACHE_SECONDS = parseInt(process.env.EXCHANGE_RATE_CACHE_SECONDS, 10) || 900; // 15 minutes
const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW',
  'SEK', 'NOK', 'DKK', 'PLN', 'TRY', 'ARS', 'ZAR', 'SAR', 'AED', 'SGD', 'NZD'
];

// Fallback exchange rates (1 USD = X currency)
const FALLBACK_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150, CAD: 1.35, AUD: 1.52, CHF: 0.89,
  CNY: 7.2, INR: 83, BRL: 4.95, MXN: 17, KRW: 1320, SEK: 10.5,
  NOK: 10.7, DKK: 6.9, PLN: 4.0, TRY: 32, ARS: 880, ZAR: 19, SAR: 3.75,
  AED: 3.67, SGD: 1.34, NZD: 1.62
};

const formatRatesResponse = (rates, source = 'exchangerate.host') => ({
  base: 'USD',
  date: new Date().toISOString().split('T')[0],
  rates: { USD: 1, ...rates },
  last_updated: new Date().toISOString(),
  source
});

const fetchLiveRates = async () => {
  const url = `https://api.exchangerate.host/latest?base=USD&symbols=${SUPPORTED_CURRENCIES.join(',')}`;
  const data = await fetchWithCache(url, {}, RATE_CACHE_SECONDS);

  if (!data || !data.rates) {
    throw new Error('Invalid exchange rate response');
  }

  return formatRatesResponse(data.rates, 'exchangerate.host');
};

export const getExchangeRates = async () => {
  try {
    return await fetchLiveRates();
  } catch (error) {
    console.error('Live exchange rate fetch failed, falling back to static rates:', error.message);
    return formatRatesResponse(FALLBACK_RATES, 'fallback_data');
  }
};

/**
 * Convert currency from one to another
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {number} amount - Amount to convert
 */
export const convertCurrency = async (from, to, amount = 1) => {
  const normalizedFrom = from.toUpperCase();
  const normalizedTo = to.toUpperCase();
  const ratesData = await getExchangeRates();

  const fromRate = normalizedFrom === ratesData.base ? 1 : ratesData.rates[normalizedFrom];
  const toRate = normalizedTo === ratesData.base ? 1 : ratesData.rates[normalizedTo];

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency code(s): ${normalizedFrom}, ${normalizedTo}`);
  }

  const usdValue = normalizedFrom === ratesData.base ? amount : amount / fromRate;
  const result = normalizedTo === ratesData.base ? usdValue : usdValue * toRate;

  return {
    from: normalizedFrom,
    to: normalizedTo,
    amount,
    result,
    rate: result / amount,
    last_updated: ratesData.last_updated,
    source: ratesData.source
  };
};

/**
 * Get historical exchange rates for currency trends
 * @param {string} base - Base currency
 * @param {string} symbols - Target currencies (comma-separated)
 * @param {number} days - Number of days back (30 or 90)
 */
export const getHistoricalRates = async (base, symbols, days = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];
  
  const url = `https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${base}&symbols=${symbols}`;
  
  try {
    const data = await fetchWithCache(url, {}, 3600); // Cache for 1 hour
    
    // Convert to simple array format
    const trend = Object.entries(data.rates || {}).map(([date, rates]) => ({
      date,
      rate: rates[symbols]
    }));
    
    return {
      base,
      symbol: symbols,
      period_days: days,
      trend,
      last_updated: new Date().toISOString(),
      source: 'exchangerate.host'
    };
  } catch (error) {
    console.error('Historical rates error:', error);
    // Return mock data as fallback
    return generateMockTrend(days);
  }
};

/**
 * Get 24-hour percentage change for a currency pair
 */
export const get24HourChange = async (from, to) => {
  try {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayRate = await convertCurrency(from, to, 1);
    
    // For 24h change, we'd need yesterday's data
    // Using a simplified calculation with current vs 1-day trend
    const trend = await getHistoricalRates(from, to, 2);
    
    if (trend.trend && trend.trend.length >= 2) {
      const oldRate = trend.trend[0].rate;
      const newRate = trend.trend[trend.trend.length - 1].rate;
      const change = ((newRate - oldRate) / oldRate) * 100;
      
      return {
        from,
        to,
        change_24h: parseFloat(change.toFixed(4)),
        current_rate: todayRate.rate
      };
    }
    
    return {
      from,
      to,
      change_24h: 0,
      current_rate: todayRate.rate
    };
  } catch (error) {
    console.error('24h change error:', error);
    return {
      from,
      to,
      change_24h: 0,
      current_rate: 1
    };
  }
};

/**
 * Generate mock trend data as fallback
 */
const generateMockTrend = (days) => {
  const trend = [];
  const baseRate = 1 + Math.random();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * 0.1;
    
    trend.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat((baseRate + variation).toFixed(4))
    });
  }
  
  return {
    trend,
    period_days: days,
    last_updated: new Date().toISOString(),
    source: 'mock_fallback'
  };
};

export default {
  getExchangeRates,
  convertCurrency,
  getHistoricalRates,
  get24HourChange
};
