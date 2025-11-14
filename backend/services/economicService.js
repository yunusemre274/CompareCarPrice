import { fetchWithCache } from '../utils/apiFetcher.js';

/**
 * Mock economic data service
 * In production, integrate with World Bank API, IMF API, OECD API
 * or other economic data providers
 */

/**
 * Get economic data for a country
 * @param {string} countryCode - ISO Alpha-2 country code
 */
export const getEconomicData = async (countryCode) => {
  // Use mock data directly to avoid API timeout issues
  return getMockEconomicData(countryCode);
};

/**
 * Get GDP data from World Bank API
 */
const getWorldBankGDP = async (countryCode) => {
  const currentYear = new Date().getFullYear() - 1; // Last complete year
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?date=${currentYear}&format=json`;
  
  try {
    const data = await fetchWithCache(url, {}, 86400); // Cache for 24 hours
    
    if (data && data[1] && data[1].length > 0) {
      const gdpValue = data[1][0].value;
      
      // Also get GDP per capita
      const perCapitaUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.PCAP.CD?date=${currentYear}&format=json`;
      const perCapitaData = await fetchWithCache(perCapitaUrl, {}, 86400);
      
      // Get growth rate
      const growthUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?date=${currentYear}&format=json`;
      const growthData = await fetchWithCache(growthUrl, {}, 86400);
      
      return {
        gdp: gdpValue || null,
        gdp_per_capita: perCapitaData?.[1]?.[0]?.value || null,
        growth_rate: growthData?.[1]?.[0]?.value || null
      };
    }
    
    return { gdp: null, gdp_per_capita: null, growth_rate: null };
  } catch (error) {
    return { gdp: null, gdp_per_capita: null, growth_rate: null };
  }
};

/**
 * Get inflation data from World Bank API
 */
const getWorldBankInflation = async (countryCode) => {
  const currentYear = new Date().getFullYear() - 1;
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?date=${currentYear}&format=json`;
  
  try {
    const data = await fetchWithCache(url, {}, 86400);
    
    if (data && data[1] && data[1].length > 0) {
      const yearlyInflation = data[1][0].value;
      const monthlyInflation = yearlyInflation ? yearlyInflation / 12 : null;
      
      return {
        yearly: yearlyInflation,
        monthly: monthlyInflation
      };
    }
    
    return { yearly: null, monthly: null };
  } catch (error) {
    return { yearly: null, monthly: null };
  }
};

/**
 * Get government data for a country
 * @param {string} countryCode - ISO Alpha-2 country code
 */
export const getGovernmentData = async (countryCode) => {
  // This would require a political data API
  // For now, returning structured mock data
  return getMockGovernmentData(countryCode);
};

/**
 * Get social data for a country
 * @param {string} countryCode - ISO Alpha-2 country code
 */
export const getSocialData = async (countryCode) => {
  try {
    const currentYear = new Date().getFullYear() - 1;
    
    // Get population from World Bank
    const popUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?date=${currentYear}&format=json`;
    const popData = await fetchWithCache(popUrl, {}, 86400);
    
    // Get birth rate
    const birthUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.DYN.CBRT.IN?date=${currentYear}&format=json`;
    const birthData = await fetchWithCache(birthUrl, {}, 86400);
    
    // Get life expectancy
    const lifeUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.DYN.LE00.IN?date=${currentYear}&format=json`;
    const lifeData = await fetchWithCache(lifeUrl, {}, 86400);
    
    return {
      population: popData?.[1]?.[0]?.value || null,
      birth_rate: birthData?.[1]?.[0]?.value || null,
      life_expectancy: lifeData?.[1]?.[0]?.value || null,
      migration_rate: getMockMigrationRate(countryCode),
      median_age: getMockMedianAge(countryCode),
      education_index: getMockEducationIndex(countryCode),
      last_updated: new Date().toISOString(),
      source: 'world_bank_api + mock_data'
    };
  } catch (error) {
    return getMockSocialData(countryCode);
  }
};

/**
 * Get minimum wage data for a country
 * @param {string} countryCode - ISO Alpha-2 country code
 */
export const getMinimumWageData = async (countryCode) => {
  // This requires specialized labor statistics API
  // Using mock data with realistic values
  return getMockMinimumWageData(countryCode);
};

// ============= MOCK DATA GENERATORS =============

const getMockEconomicData = (countryCode) => {
  const mockData = {
    US: { gdp: 25400000000000, gdp_per_capita: 76398, inflation: 3.4, interest: 5.5, unemployment: 3.7, ppi: 100, welfare: 8.5 },
    GB: { gdp: 3070000000000, gdp_per_capita: 45850, inflation: 4.0, interest: 5.25, unemployment: 4.2, ppi: 89, welfare: 8.2 },
    DE: { gdp: 4080000000000, gdp_per_capita: 48756, inflation: 3.8, interest: 4.5, unemployment: 3.1, ppi: 92, welfare: 8.7 },
    FR: { gdp: 2780000000000, gdp_per_capita: 42330, inflation: 4.9, interest: 4.5, unemployment: 7.3, ppi: 88, welfare: 8.3 },
    JP: { gdp: 4230000000000, gdp_per_capita: 33815, inflation: 2.5, interest: -0.1, unemployment: 2.6, ppi: 85, welfare: 8.0 },
    CN: { gdp: 17960000000000, gdp_per_capita: 12720, inflation: 0.2, interest: 3.45, unemployment: 5.2, ppi: 75, welfare: 6.8 },
    IN: { gdp: 3390000000000, gdp_per_capita: 2389, inflation: 5.1, interest: 6.5, unemployment: 8.0, ppi: 45, welfare: 5.5 },
    BR: { gdp: 1920000000000, gdp_per_capita: 8917, inflation: 4.6, interest: 11.75, unemployment: 8.5, ppi: 52, welfare: 6.2 },
    TR: { gdp: 905000000000, gdp_per_capita: 10655, inflation: 64.8, interest: 42.5, unemployment: 10.2, ppi: 48, welfare: 6.0 },
    AU: { gdp: 1680000000000, gdp_per_capita: 64491, inflation: 5.4, interest: 4.35, unemployment: 3.7, ppi: 95, welfare: 8.8 }
  };
  
  const data = mockData[countryCode] || mockData.US;
  
  return {
    country_code: countryCode,
    gdp: data.gdp,
    gdp_per_capita: data.gdp_per_capita,
    gdp_growth_rate: 2.5 + (Math.random() * 2),
    inflation_rate_yearly: data.inflation,
    inflation_rate_monthly: data.inflation / 12,
    interest_rate: data.interest,
    unemployment_rate: data.unemployment,
    purchasing_power_index: data.ppi,
    welfare_score: data.welfare,
    last_updated: new Date().toISOString(),
    source: 'mock_data'
  };
};

const getMockGovernmentData = (countryCode) => {
  const mockGov = {
    US: { president: 'Joe Biden', minister: 'Janet Yellen', type: 'Federal Presidential Republic' },
    GB: { president: 'King Charles III', minister: 'Jeremy Hunt', type: 'Parliamentary Constitutional Monarchy' },
    DE: { president: 'Frank-Walter Steinmeier', minister: 'Christian Lindner', type: 'Federal Parliamentary Republic' },
    FR: { president: 'Emmanuel Macron', minister: 'Bruno Le Maire', type: 'Semi-Presidential Republic' },
    JP: { president: 'Fumio Kishida', minister: 'Shunichi Suzuki', type: 'Parliamentary Constitutional Monarchy' },
    CN: { president: 'Xi Jinping', minister: 'He Lifeng', type: 'Socialist Republic' },
    IN: { president: 'Droupadi Murmu', minister: 'Nirmala Sitharaman', type: 'Federal Parliamentary Republic' },
    BR: { president: 'Luiz Inácio Lula da Silva', minister: 'Fernando Haddad', type: 'Federal Presidential Republic' },
    TR: { president: 'Recep Tayyip Erdoğan', minister: 'Mehmet Şimşek', type: 'Presidential Republic' },
    AU: { president: 'Anthony Albanese', minister: 'Jim Chalmers', type: 'Federal Parliamentary Constitutional Monarchy' }
  };
  
  const gov = mockGov[countryCode] || mockGov.US;
  
  return {
    country_code: countryCode,
    president: gov.president,
    finance_minister: gov.minister,
    government_type: gov.type,
    last_updated: new Date().toISOString(),
    source: 'mock_data'
  };
};

const getMockSocialData = (countryCode) => {
  return {
    population: 50000000 + Math.random() * 200000000,
    birth_rate: 10 + Math.random() * 20,
    migration_rate: -5 + Math.random() * 10,
    median_age: 25 + Math.random() * 20,
    education_index: 0.6 + Math.random() * 0.35,
    last_updated: new Date().toISOString(),
    source: 'mock_data'
  };
};

const getMockMinimumWageData = (countryCode) => {
  const mockWages = {
    US: { monthly: 2340, hourly: 13.5 },
    GB: { monthly: 2100, hourly: 12.1 },
    DE: { monthly: 2080, hourly: 12.0 },
    FR: { monthly: 1747, hourly: 10.1 },
    JP: { monthly: 1450, hourly: 8.4 },
    CN: { monthly: 420, hourly: 2.4 },
    IN: { monthly: 180, hourly: 1.0 },
    BR: { monthly: 280, hourly: 1.6 },
    TR: { monthly: 560, hourly: 3.2 },
    AU: { monthly: 3200, hourly: 18.5 }
  };
  
  const wage = mockWages[countryCode] || mockWages.US;
  
  return {
    country_code: countryCode,
    monthly: wage.monthly,
    yearly: wage.monthly * 12,
    weekly: wage.monthly / 4.33,
    hourly: wage.hourly,
    currency: 'USD',
    last_updated: new Date().toISOString(),
    source: 'mock_data'
  };
};

const getMockInterestRate = (code) => 3.0 + Math.random() * 5;
const getMockUnemploymentRate = (code) => 3.0 + Math.random() * 8;
const getMockPurchasingPowerIndex = (code) => 40 + Math.random() * 60;
const getMockWelfareScore = (code) => 5.0 + Math.random() * 4;
const getMockMigrationRate = (code) => -5 + Math.random() * 10;
const getMockMedianAge = (code) => 25 + Math.random() * 20;
const getMockEducationIndex = (code) => 0.6 + Math.random() * 0.35;

export default {
  getEconomicData,
  getGovernmentData,
  getSocialData,
  getMinimumWageData
};
