import * as carService from '../services/carService.js';
import * as countryService from '../services/countryService.js';
import * as economicService from '../services/economicService.js';
import * as currencyService from '../services/currencyService.js';
import { formatCurrencyResponse } from '../utils/currencyFormatter.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * GET /api/car?name={car_name}
 * Get car prices across all countries with economic comparison
 */
export const getCarComparison = asyncHandler(async (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({
      error: true,
      message: 'Car name is required',
      status: 400
    });
  }
  
  try {
    // Get car information
    const car = await carService.getCarByName(name);
    
    // Get all countries (with fallback)
    let countriesData;
    try {
      countriesData = await countryService.getAllCountries();
    } catch (error) {
      console.error('Error fetching countries:', error.message);
      // Use fallback - getAllCountries now has fallback built-in, but just in case
      countriesData = { countries: [], total: 0 };
    }
    
    // Get exchange rates (with fallback)
    let exchangeRates;
    try {
      exchangeRates = await currencyService.getExchangeRates();
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
      // Use fallback - getExchangeRates now has fallback built-in, but just in case
      exchangeRates = { rates: { USD: 1 } };
    }
    
    // Ensure we have countries data (services should provide fallback, but double-check)
    if (!countriesData || !countriesData.countries || countriesData.countries.length === 0) {
      console.warn('No countries data available, using minimal fallback');
      countriesData = {
        countries: [{ name: 'United States', alpha2: 'US', currency: 'USD', currency_name: 'US Dollar', currency_symbol: '$', flag: '', flag_emoji: '🇺🇸' }],
        total: 1
      };
    }
    
    // Process top countries (limit to 30 for performance)
    const topCountries = countriesData.countries.slice(0, 30);
    
    // Build comparison data for each country
    const comparisonPromises = topCountries.map(async (country) => {
    try {
      // Get car price for this country
      const carPrice = await carService.getCarPriceForCountry(name, country.alpha2);
      
      // Get minimum wage data
      const minWage = await economicService.getMinimumWageData(country.alpha2);
      
      // Get exchange rate for local currency
      const localCurrency = country.currency || 'USD';
      const exchangeRate = (exchangeRates && exchangeRates.rates && exchangeRates.rates[localCurrency]) || 1;
      const usdToLocalRate = exchangeRate;
      
      // Calculate prices in local currency
      const taxedPriceLocal = carPrice.taxed_price_usd * usdToLocalRate;
      const taxFreePriceLocal = carPrice.tax_free_price_usd * usdToLocalRate;
      
      // Calculate days/hours required to buy
      const monthlyWageUSD = minWage.monthly;
      const hourlyWageUSD = minWage.hourly;
      
      const daysRequired = monthlyWageUSD > 0 ? (carPrice.taxed_price_usd / (monthlyWageUSD / 30)) : 999999;
      const hoursRequired = hourlyWageUSD > 0 ? (carPrice.taxed_price_usd / hourlyWageUSD) : 999999;
      
      // Calculate purchasing power score (0-100)
      const purchasingPowerScore = Math.max(0, 100 - (daysRequired / 10));
      
      // Get equivalent values
      const equivalents = carService.calculateEquivalentValues(carPrice.taxed_price_usd, country.alpha2);
      
      return {
        country_name: country.name || 'Unknown',
        country_code: country.alpha2 || 'XX',
        flag: country.flag || '',
        flag_emoji: country.flag_emoji || '🏳️',
        
        // Pricing
        taxed_price: formatCurrencyResponse(taxedPriceLocal, localCurrency, 1 / usdToLocalRate),
        tax_free_price: formatCurrencyResponse(taxFreePriceLocal, localCurrency, 1 / usdToLocalRate),
        tax_rate_percentage: carPrice.tax_rate_percentage,
        tax_amount: formatCurrencyResponse(carPrice.tax_amount_usd * usdToLocalRate, localCurrency, 1 / usdToLocalRate),
        
        // Minimum wage
        minimum_wage: {
          monthly: formatCurrencyResponse(minWage.monthly, 'USD'),
          yearly: formatCurrencyResponse(minWage.yearly, 'USD'),
          weekly: formatCurrencyResponse(minWage.weekly, 'USD'),
          hourly: formatCurrencyResponse(minWage.hourly, 'USD')
        },
        
        // Affordability metrics
        days_required: parseFloat(daysRequired.toFixed(1)),
        hours_required: parseFloat(hoursRequired.toFixed(0)),
        purchasing_power_score: parseFloat(purchasingPowerScore.toFixed(2)),
        
        // Equivalent values
        equivalent_value: equivalents,
        
        // Currency info
        local_currency: {
          code: localCurrency,
          name: country.currency_name || localCurrency,
          symbol: country.currency_symbol || '$',
          usd_exchange_rate: parseFloat((1 / usdToLocalRate).toFixed(4))
        }
      };
    } catch (error) {
      console.error(`Error processing ${country.name}:`, error.message);
      return null;
    }
    });
    
    // Wait for all countries to be processed
    const allResults = await Promise.all(comparisonPromises);
    
    // Filter out nulls and sort by purchasing power (best first)
    const countries = allResults
      .filter(c => c !== null)
      .sort((a, b) => a.days_required - b.days_required);
    
    res.json({
      car: {
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        category: car.category,
        base_price_usd: car.base_price_usd,
        image: car.image
      },
      countries,
      total_countries: countries.length,
      last_updated: new Date().toISOString(),
      source: 'multiple_apis'
    });
  } catch (error) {
    console.error('Error in getCarComparison:', error);
    throw error; // Re-throw to be handled by asyncHandler
  }
});

/**
 * GET /api/car/search?q={query}
 * Search for available cars
 */
export const searchCars = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    // Return all cars if no query
    const allCars = await carService.getAllCars();
    return res.json(allCars);
  }
  
  const results = await carService.searchCars(q);
  res.json(results);
});

export default {
  getCarComparison,
  searchCars
};
