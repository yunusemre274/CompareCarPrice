import * as countryService from '../services/countryService.js';
import * as economicService from '../services/economicService.js';
import * as currencyService from '../services/currencyService.js';
import { formatCurrencyResponse } from '../utils/currencyFormatter.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * GET /api/country/:countryCode
 * Get detailed country information including economy, government, social data
 */
export const getCountryDetails = asyncHandler(async (req, res) => {
  const { countryCode } = req.params;
  
  if (!countryCode) {
    return res.status(400).json({
      error: true,
      message: 'Country code is required',
      status: 400
    });
  }
  
  // Fetch all data in parallel for better performance
  const [
    basicInfo,
    economicData,
    governmentData,
    socialData,
    minWageData,
    exchangeRates
  ] = await Promise.all([
    countryService.getCountryByCode(countryCode),
    economicService.getEconomicData(countryCode),
    economicService.getGovernmentData(countryCode),
    economicService.getSocialData(countryCode),
    economicService.getMinimumWageData(countryCode),
    currencyService.getExchangeRates()
  ]);
  
  // Get currency information
  const primaryCurrency = basicInfo.currencies[0];
  const currencyCode = primaryCurrency?.code || 'USD';
  const usdRate = exchangeRates.rates[currencyCode] || 1;
  
  // Get currency trend (30 and 90 days)
  const [trend30, trend90] = await Promise.all([
    currencyService.getHistoricalRates('USD', currencyCode, 30),
    currencyService.getHistoricalRates('USD', currencyCode, 90)
  ]);
  
  // Get 24-hour change
  const change24h = await currencyService.get24HourChange('USD', currencyCode);
  
  // Structure response by categories
  res.json({
    // Basic country info
    country: {
      name: basicInfo.name,
      official_name: basicInfo.official_name,
      alpha2: basicInfo.alpha2,
      alpha3: basicInfo.alpha3,
      flag: basicInfo.flag,
      flag_emoji: basicInfo.flag_emoji,
      coat_of_arms: basicInfo.coat_of_arms,
      capital: basicInfo.capital,
      region: basicInfo.region,
      subregion: basicInfo.subregion,
      continents: basicInfo.continents,
      independent: basicInfo.independent,
      un_member: basicInfo.un_member
    },
    
    // Economy data
    economy: {
      gdp: economicData.gdp,
      gdp_per_capita: economicData.gdp_per_capita,
      gdp_growth_rate: economicData.gdp_growth_rate,
      inflation_rate: {
        yearly: economicData.inflation_rate_yearly,
        monthly: economicData.inflation_rate_monthly
      },
      interest_rate: economicData.interest_rate,
      unemployment_rate: economicData.unemployment_rate,
      purchasing_power_index: economicData.purchasing_power_index,
      welfare_score: economicData.welfare_score
    },
    
    // Government data
    government: {
      president: governmentData.president,
      finance_minister: governmentData.finance_minister,
      government_type: governmentData.government_type
    },
    
    // Social data
    social: {
      population: socialData.population,
      birth_rate: socialData.birth_rate,
      migration_rate: socialData.migration_rate,
      median_age: socialData.median_age,
      education_index: socialData.education_index,
      life_expectancy: socialData.life_expectancy
    },
    
    // Minimum wage
    minimum_wage: {
      monthly: formatCurrencyResponse(minWageData.monthly, 'USD'),
      yearly: formatCurrencyResponse(minWageData.yearly, 'USD'),
      weekly: formatCurrencyResponse(minWageData.weekly, 'USD'),
      hourly: formatCurrencyResponse(minWageData.hourly, 'USD')
    },
    
    // Currency information
    currency: {
      code: currencyCode,
      name: primaryCurrency?.name || 'US Dollar',
      symbol: primaryCurrency?.symbol || '$',
      usd_exchange_rate: parseFloat((1 / usdRate).toFixed(4)),
      change_24h_percentage: change24h.change_24h,
      trend_30_days: trend30.trend,
      trend_90_days: trend90.trend
    },
    
    // Geographic data
    geography: {
      area: basicInfo.area,
      latitude: basicInfo.latitude,
      longitude: basicInfo.longitude,
      landlocked: basicInfo.landlocked,
      borders: basicInfo.borders,
      timezones: basicInfo.timezones
    },
    
    // Languages
    languages: basicInfo.languages,
    
    last_updated: new Date().toISOString(),
    source: 'multiple_apis'
  });
});

/**
 * GET /api/countries
 * Get list of all countries for dropdown
 */
export const getAllCountries = asyncHandler(async (req, res) => {
  const countriesData = await countryService.getAllCountries();
  res.json(countriesData);
});

/**
 * GET /api/countries/search?q={query}
 * Search countries by name
 */
export const searchCountries = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      error: true,
      message: 'Search query is required',
      status: 400
    });
  }
  
  const results = await countryService.searchCountries(q);
  res.json(results);
});

export default {
  getCountryDetails,
  getAllCountries,
  searchCountries
};
