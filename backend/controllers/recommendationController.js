import * as carService from '../services/carService.js';
import * as countryService from '../services/countryService.js';
import * as economicService from '../services/economicService.js';
import * as currencyService from '../services/currencyService.js';
import { formatCurrencyResponse } from '../utils/currencyFormatter.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * GET /api/car/recommendations?name={car_name}
 * Get best country recommendations for buying a car
 */
export const getCarRecommendations = asyncHandler(async (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({
      error: true,
      message: 'Car name is required',
      status: 400
    });
  }
  
  // Get car information
  const car = await carService.getCarByName(name);
  
  // Get all countries
  const countriesData = await countryService.getAllCountries();
  
  // Get exchange rates
  const exchangeRates = await currencyService.getExchangeRates();
  
  // Analyze top 30 countries
  const topCountries = countriesData.countries.slice(0, 30);
  
  // Calculate metrics for each country
  const countryAnalysis = await Promise.all(
    topCountries.map(async (country) => {
      try {
        const carPrice = await carService.getCarPriceForCountry(name, country.alpha2);
        const minWage = await economicService.getMinimumWageData(country.alpha2);
        const economicData = await economicService.getEconomicData(country.alpha2);
        
        const localCurrency = country.currency || 'USD';
        const exchangeRate = exchangeRates.rates[localCurrency] || 1;
        
        const daysRequired = minWage.monthly > 0 
          ? (carPrice.taxed_price_usd / (minWage.monthly / 30)) 
          : 999999;
        
        const purchasingPowerScore = Math.max(0, 100 - (daysRequired / 10));
        
        return {
          country_name: country.name,
          country_code: country.alpha2,
          flag: country.flag,
          
          // Price metrics
          taxed_price_usd: carPrice.taxed_price_usd,
          tax_free_price_usd: carPrice.tax_free_price_usd,
          tax_rate: carPrice.tax_rate_percentage,
          
          // Affordability metrics
          days_required: daysRequired,
          purchasing_power_score: purchasingPowerScore,
          
          // Economic metrics
          welfare_score: economicData.welfare_score,
          inflation_rate: economicData.inflation_rate_yearly,
          purchasing_power_index: economicData.purchasing_power_index,
          
          // Monthly wage
          monthly_wage_usd: minWage.monthly
        };
      } catch (error) {
        return null;
      }
    })
  );
  
  // Filter out nulls
  const validCountries = countryAnalysis.filter(c => c !== null);
  
  // Find best countries by different criteria
  const sortedByAffordability = [...validCountries].sort((a, b) => a.days_required - b.days_required);
  const sortedByTaxFree = [...validCountries].sort((a, b) => a.tax_free_price_usd - b.tax_free_price_usd);
  const sortedByTaxedPrice = [...validCountries].sort((a, b) => a.taxed_price_usd - b.taxed_price_usd);
  const sortedByPurchasingPower = [...validCountries].sort((a, b) => b.purchasing_power_score - a.purchasing_power_score);
  const sortedByWelfare = [...validCountries].sort((a, b) => b.welfare_score - a.welfare_score);
  const sortedByLowestTax = [...validCountries].sort((a, b) => a.tax_rate - b.tax_rate);
  
  // Calculate overall best country (weighted score)
  const countriesWithScore = validCountries.map(c => {
    // Lower is better for these metrics
    const affordabilityScore = (1 - (c.days_required / 1000)) * 35;
    const priceScore = (1 - (c.taxed_price_usd / 100000)) * 25;
    const taxScore = (1 - (c.tax_rate / 100)) * 20;
    
    // Higher is better for these
    const welfareScore = (c.welfare_score / 10) * 10;
    const ppiScore = (c.purchasing_power_index / 100) * 10;
    
    const totalScore = Math.max(0, 
      affordabilityScore + priceScore + taxScore + welfareScore + ppiScore
    );
    
    return {
      ...c,
      overall_score: parseFloat(totalScore.toFixed(2))
    };
  });
  
  const sortedByOverall = [...countriesWithScore].sort((a, b) => b.overall_score - a.overall_score);
  
  res.json({
    car: {
      name: car.name,
      brand: car.brand,
      model: car.model,
      base_price_usd: car.base_price_usd
    },
    
    recommendations: {
      // Best overall (weighted score)
      best_overall: {
        title: 'Best Overall Value',
        description: 'Best combination of price, affordability, and quality of life',
        countries: sortedByOverall.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          overall_score: c.overall_score,
          taxed_price_usd: c.taxed_price_usd,
          days_required: parseFloat(c.days_required.toFixed(1)),
          welfare_score: c.welfare_score,
          reason: `Best value with score ${c.overall_score}/100`
        }))
      },
      
      // Most affordable (by purchasing power)
      most_affordable: {
        title: 'Most Affordable',
        description: 'Countries where you can buy this car fastest based on minimum wage',
        countries: sortedByAffordability.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          days_required: parseFloat(c.days_required.toFixed(1)),
          monthly_wage_usd: c.monthly_wage_usd,
          taxed_price_usd: c.taxed_price_usd,
          reason: `Only ${c.days_required.toFixed(1)} days of work required`
        }))
      },
      
      // Cheapest price (tax-free)
      cheapest_tax_free: {
        title: 'Lowest Tax-Free Price',
        description: 'Countries with lowest base car price before taxes',
        countries: sortedByTaxFree.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          tax_free_price_usd: c.tax_free_price_usd,
          tax_rate: c.tax_rate,
          reason: `Base price: $${c.tax_free_price_usd.toFixed(0)}`
        }))
      },
      
      // Cheapest total price
      cheapest_total: {
        title: 'Lowest Total Price',
        description: 'Countries with lowest final price including all taxes',
        countries: sortedByTaxedPrice.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          taxed_price_usd: c.taxed_price_usd,
          tax_rate: c.tax_rate,
          reason: `Total price: $${c.taxed_price_usd.toFixed(0)}`
        }))
      },
      
      // Strongest purchasing power
      best_purchasing_power: {
        title: 'Strongest Purchasing Power',
        description: 'Countries with best wage-to-price ratio',
        countries: sortedByPurchasingPower.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          purchasing_power_score: c.purchasing_power_score,
          monthly_wage_usd: c.monthly_wage_usd,
          days_required: parseFloat(c.days_required.toFixed(1)),
          reason: `Purchasing power score: ${c.purchasing_power_score.toFixed(1)}/100`
        }))
      },
      
      // Best quality of life
      best_welfare: {
        title: 'Best Quality of Life',
        description: 'Countries with highest welfare and living standards',
        countries: sortedByWelfare.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          welfare_score: c.welfare_score,
          taxed_price_usd: c.taxed_price_usd,
          days_required: parseFloat(c.days_required.toFixed(1)),
          reason: `Welfare score: ${c.welfare_score.toFixed(1)}/10`
        }))
      },
      
      // Lowest tax
      lowest_tax: {
        title: 'Lowest Tax Rate',
        description: 'Countries with lowest automotive taxes',
        countries: sortedByLowestTax.slice(0, 5).map(c => ({
          country_name: c.country_name,
          country_code: c.country_code,
          flag: c.flag,
          tax_rate: c.tax_rate,
          taxed_price_usd: c.taxed_price_usd,
          tax_free_price_usd: c.tax_free_price_usd,
          reason: `Only ${c.tax_rate.toFixed(1)}% tax`
        }))
      }
    },
    
    last_updated: new Date().toISOString(),
    source: 'multiple_apis'
  });
});

export default {
  getCarRecommendations
};
