import { fetchWithCache } from '../utils/apiFetcher.js';

/**
 * Fallback country data (major countries)
 * Used when external API is unavailable
 */
const FALLBACK_COUNTRIES = [
  { name: 'United States', alpha2: 'US', alpha3: 'USA', currency: 'USD', currency_name: 'US Dollar', currency_symbol: '$', region: 'Americas', subregion: 'North America', population: 331900000, capital: 'Washington D.C.', flag: '🇺🇸' },
  { name: 'United Kingdom', alpha2: 'GB', alpha3: 'GBR', currency: 'GBP', currency_name: 'British Pound', currency_symbol: '£', region: 'Europe', subregion: 'Northern Europe', population: 67000000, capital: 'London', flag: '🇬🇧' },
  { name: 'Canada', alpha2: 'CA', alpha3: 'CAN', currency: 'CAD', currency_name: 'Canadian Dollar', currency_symbol: 'C$', region: 'Americas', subregion: 'North America', population: 38000000, capital: 'Ottawa', flag: '🇨🇦' },
  { name: 'Germany', alpha2: 'DE', alpha3: 'DEU', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Western Europe', population: 83000000, capital: 'Berlin', flag: '🇩🇪' },
  { name: 'France', alpha2: 'FR', alpha3: 'FRA', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Western Europe', population: 67000000, capital: 'Paris', flag: '🇫🇷' },
  { name: 'Italy', alpha2: 'IT', alpha3: 'ITA', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Southern Europe', population: 60000000, capital: 'Rome', flag: '🇮🇹' },
  { name: 'Spain', alpha2: 'ES', alpha3: 'ESP', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Southern Europe', population: 47000000, capital: 'Madrid', flag: '🇪🇸' },
  { name: 'Japan', alpha2: 'JP', alpha3: 'JPN', currency: 'JPY', currency_name: 'Japanese Yen', currency_symbol: '¥', region: 'Asia', subregion: 'Eastern Asia', population: 125000000, capital: 'Tokyo', flag: '🇯🇵' },
  { name: 'China', alpha2: 'CN', alpha3: 'CHN', currency: 'CNY', currency_name: 'Chinese Yuan', currency_symbol: '¥', region: 'Asia', subregion: 'Eastern Asia', population: 1400000000, capital: 'Beijing', flag: '🇨🇳' },
  { name: 'India', alpha2: 'IN', alpha3: 'IND', currency: 'INR', currency_name: 'Indian Rupee', currency_symbol: '₹', region: 'Asia', subregion: 'Southern Asia', population: 1380000000, capital: 'New Delhi', flag: '🇮🇳' },
  { name: 'Australia', alpha2: 'AU', alpha3: 'AUS', currency: 'AUD', currency_name: 'Australian Dollar', currency_symbol: 'A$', region: 'Oceania', subregion: 'Australia and New Zealand', population: 26000000, capital: 'Canberra', flag: '🇦🇺' },
  { name: 'Brazil', alpha2: 'BR', alpha3: 'BRA', currency: 'BRL', currency_name: 'Brazilian Real', currency_symbol: 'R$', region: 'Americas', subregion: 'South America', population: 215000000, capital: 'Brasília', flag: '🇧🇷' },
  { name: 'Mexico', alpha2: 'MX', alpha3: 'MEX', currency: 'MXN', currency_name: 'Mexican Peso', currency_symbol: '$', region: 'Americas', subregion: 'Central America', population: 130000000, capital: 'Mexico City', flag: '🇲🇽' },
  { name: 'Russia', alpha2: 'RU', alpha3: 'RUS', currency: 'RUB', currency_name: 'Russian Ruble', currency_symbol: '₽', region: 'Europe', subregion: 'Eastern Europe', population: 144000000, capital: 'Moscow', flag: '🇷🇺' },
  { name: 'South Korea', alpha2: 'KR', alpha3: 'KOR', currency: 'KRW', currency_name: 'South Korean Won', currency_symbol: '₩', region: 'Asia', subregion: 'Eastern Asia', population: 51000000, capital: 'Seoul', flag: '🇰🇷' },
  { name: 'Netherlands', alpha2: 'NL', alpha3: 'NLD', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Western Europe', population: 17000000, capital: 'Amsterdam', flag: '🇳🇱' },
  { name: 'Sweden', alpha2: 'SE', alpha3: 'SWE', currency: 'SEK', currency_name: 'Swedish Krona', currency_symbol: 'kr', region: 'Europe', subregion: 'Northern Europe', population: 10000000, capital: 'Stockholm', flag: '🇸🇪' },
  { name: 'Switzerland', alpha2: 'CH', alpha3: 'CHE', currency: 'CHF', currency_name: 'Swiss Franc', currency_symbol: 'Fr', region: 'Europe', subregion: 'Western Europe', population: 8700000, capital: 'Bern', flag: '🇨🇭' },
  { name: 'Norway', alpha2: 'NO', alpha3: 'NOR', currency: 'NOK', currency_name: 'Norwegian Krone', currency_symbol: 'kr', region: 'Europe', subregion: 'Northern Europe', population: 5400000, capital: 'Oslo', flag: '🇳🇴' },
  { name: 'Denmark', alpha2: 'DK', alpha3: 'DNK', currency: 'DKK', currency_name: 'Danish Krone', currency_symbol: 'kr', region: 'Europe', subregion: 'Northern Europe', population: 5800000, capital: 'Copenhagen', flag: '🇩🇰' },
  { name: 'Poland', alpha2: 'PL', alpha3: 'POL', currency: 'PLN', currency_name: 'Polish Zloty', currency_symbol: 'zł', region: 'Europe', subregion: 'Eastern Europe', population: 38000000, capital: 'Warsaw', flag: '🇵🇱' },
  { name: 'Turkey', alpha2: 'TR', alpha3: 'TUR', currency: 'TRY', currency_name: 'Turkish Lira', currency_symbol: '₺', region: 'Asia', subregion: 'Western Asia', population: 84000000, capital: 'Ankara', flag: '🇹🇷' },
  { name: 'Argentina', alpha2: 'AR', alpha3: 'ARG', currency: 'ARS', currency_name: 'Argentine Peso', currency_symbol: '$', region: 'Americas', subregion: 'South America', population: 45000000, capital: 'Buenos Aires', flag: '🇦🇷' },
  { name: 'South Africa', alpha2: 'ZA', alpha3: 'ZAF', currency: 'ZAR', currency_name: 'South African Rand', currency_symbol: 'R', region: 'Africa', subregion: 'Southern Africa', population: 60000000, capital: 'Cape Town', flag: '🇿🇦' },
  { name: 'Saudi Arabia', alpha2: 'SA', alpha3: 'SAU', currency: 'SAR', currency_name: 'Saudi Riyal', currency_symbol: '﷼', region: 'Asia', subregion: 'Western Asia', population: 35000000, capital: 'Riyadh', flag: '🇸🇦' },
  { name: 'United Arab Emirates', alpha2: 'AE', alpha3: 'ARE', currency: 'AED', currency_name: 'UAE Dirham', currency_symbol: 'د.إ', region: 'Asia', subregion: 'Western Asia', population: 10000000, capital: 'Abu Dhabi', flag: '🇦🇪' },
  { name: 'Singapore', alpha2: 'SG', alpha3: 'SGP', currency: 'SGD', currency_name: 'Singapore Dollar', currency_symbol: 'S$', region: 'Asia', subregion: 'South-Eastern Asia', population: 5700000, capital: 'Singapore', flag: '🇸🇬' },
  { name: 'New Zealand', alpha2: 'NZ', alpha3: 'NZL', currency: 'NZD', currency_name: 'New Zealand Dollar', currency_symbol: 'NZ$', region: 'Oceania', subregion: 'Australia and New Zealand', population: 5100000, capital: 'Wellington', flag: '🇳🇿' },
  { name: 'Belgium', alpha2: 'BE', alpha3: 'BEL', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Western Europe', population: 11600000, capital: 'Brussels', flag: '🇧🇪' },
  { name: 'Austria', alpha2: 'AT', alpha3: 'AUT', currency: 'EUR', currency_name: 'Euro', currency_symbol: '€', region: 'Europe', subregion: 'Western Europe', population: 9000000, capital: 'Vienna', flag: '🇦🇹' }
];

/**
 * Get all countries with basic information
 * Using REST Countries API (free, no key required)
 * Falls back to static data if API fails
 */
export const getAllCountries = async () => {
  // Use fallback data directly for now since REST Countries API is unreliable
  console.log('[CountryService] Using fallback country data');
  
  const countries = FALLBACK_COUNTRIES.map(country => ({
    name: country.name,
    official_name: country.name,
    alpha2: country.alpha2,
    alpha3: country.alpha3,
    flag: `https://flagcdn.com/w320/${country.alpha2.toLowerCase()}.png`,
    flag_emoji: country.flag,
    currency: country.currency,
    currency_name: country.currency_name,
    currency_symbol: country.currency_symbol,
    region: country.region,
    subregion: country.subregion,
    population: country.population,
    capital: country.capital,
    languages: [],
    timezones: []
  }));
  
  return {
    countries,
    total: countries.length,
    last_updated: new Date().toISOString(),
    source: 'fallback_data'
  };
  
  /* Commented out REST Countries API call - keeping for future use
  const url = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,flag,currencies,region,subregion,population,capital,languages,timezones';
  
  try {
    const data = await fetchWithCache(url, {}, 3600); // Cache for 1 hour
    
    // Check if data is valid array (REST Countries API returns array)
    if (!data) {
      throw new Error('No data received from API');
    }
    
    // Check if it's an error response object
    if (data.status || data.message || data.error) {
      console.warn('API returned error response:', data);
      throw new Error(data.message || 'API returned error');
    }
    
    // Check if data is valid array
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('API returned invalid data format:', typeof data);
      throw new Error('Invalid data format received from API');
    }
    
    // Format for dropdown usage
    const countries = data.map(country => ({
      name: country.name.common,
      official_name: country.name.official,
      alpha2: country.cca2,
      alpha3: country.cca3,
      flag: country.flags?.svg || country.flags?.png || '',
      flag_emoji: country.flag || '',
      currency: country.currencies ? Object.keys(country.currencies)[0] : null,
      currency_name: country.currencies ? Object.values(country.currencies)[0]?.name : null,
      currency_symbol: country.currencies ? Object.values(country.currencies)[0]?.symbol : null,
      region: country.region || 'Unknown',
      subregion: country.subregion || 'Unknown',
      population: country.population || 0,
      capital: country.capital?.[0] || 'N/A',
      languages: country.languages ? Object.values(country.languages) : [],
      timezones: country.timezones || []
    }));
    
    // Sort alphabetically
    countries.sort((a, b) => a.name.localeCompare(b.name));
    
    return {
      countries,
      total: countries.length,
      last_updated: new Date().toISOString(),
      source: 'restcountries.com'
    };
  } catch (error) {
    console.error('Countries API error:', error.message);
    console.log('Using fallback country data');
    
    // Use fallback data
    const countries = FALLBACK_COUNTRIES.map(country => ({
      name: country.name,
      official_name: country.name,
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      flag: '',
      flag_emoji: country.flag,
      currency: country.currency,
      currency_name: country.currency_name,
      currency_symbol: country.currency_symbol,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      capital: country.capital,
      languages: [],
      timezones: []
    }));
    
    return {
      countries,
      total: countries.length,
      last_updated: new Date().toISOString(),
      source: 'fallback_data',
      warning: 'Using fallback data - external API unavailable'
    };
  }
  */
};

/**
 * Get detailed country information by country code
 * @param {string} countryCode - ISO Alpha-2 or Alpha-3 country code
 */
export const getCountryByCode = async (countryCode) => {
  // Use fallback data
  const country = FALLBACK_COUNTRIES.find(
    c => c.alpha2 === countryCode.toUpperCase() || c.alpha3 === countryCode.toUpperCase()
  );
  
  if (!country) {
    // Return a generic country object
    return {
      name: 'Unknown',
      official_name: 'Unknown',
      alpha2: countryCode.toUpperCase(),
      alpha3: countryCode.toUpperCase(),
      flag: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`,
      flag_emoji: '🏳️',
      coat_of_arms: '',
      region: 'Unknown',
      subregion: 'Unknown',
      capital: 'Unknown',
      latitude: 0,
      longitude: 0,
      area: 0,
      landlocked: false,
      borders: [],
      currencies: [{ code: 'USD', name: 'US Dollar', symbol: '$' }],
      population: 0,
      languages: [],
      timezones: [],
      continents: [],
      independent: true,
      un_member: true
    };
  }
  
  return {
    name: country.name,
    official_name: country.name,
    alpha2: country.alpha2,
    alpha3: country.alpha3,
    flag: `https://flagcdn.com/w320/${country.alpha2.toLowerCase()}.png`,
    flag_emoji: country.flag,
    coat_of_arms: '',
    
    // Geographic data
    region: country.region,
    subregion: country.subregion,
    capital: country.capital,
    latitude: 0,
    longitude: 0,
    area: 0,
    landlocked: false,
    borders: [],
    
    // Currency data
    currencies: [{
      code: country.currency,
      name: country.currency_name,
      symbol: country.currency_symbol
    }],
    
    // Population data
    population: country.population,
    
    // Language data
    languages: [],
    
    // Other data
    timezones: [],
    continents: [],
    independent: true,
    un_member: true
  };
};

/**
 * Search countries by name
 * @param {string} name - Country name to search
 */
export const searchCountries = async (name) => {
  // Use fallback data
  const results = FALLBACK_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(name.toLowerCase())
  );
  
  return results.map(country => ({
    name: country.name,
    alpha2: country.alpha2,
    flag: `https://flagcdn.com/w320/${country.alpha2.toLowerCase()}.png`,
    region: country.region,
    population: country.population
  }));
};

export default {
  getAllCountries,
  getCountryByCode,
  searchCountries
};
