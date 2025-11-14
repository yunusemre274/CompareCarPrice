// API Service for backend integration
// Always use full URL to backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface CountryComparisonData {
  country_name: string;
  country_code: string;
  flag: string;
  flag_emoji: string;
  taxed_price: PriceInfo;
  tax_free_price: PriceInfo;
  tax_rate_percentage: number;
  tax_amount: PriceInfo;
  minimum_wage: {
    monthly: PriceInfo;
    yearly: PriceInfo;
    weekly: PriceInfo;
    hourly: PriceInfo;
  };
  days_required: number;
  hours_required: number;
  purchasing_power_score: number;
  equivalent_value: {
    gold_equivalent: { ounces: number; description: string };
    real_estate_equivalent: { percentage: number; description: string };
    electronics_equivalent: { iphones: number; description: string };
  };
  local_currency: {
    code: string;
    name: string;
    symbol: string;
    usd_exchange_rate: number;
  };
}

export interface PriceInfo {
  value: number;
  formatted_value_local: string;
  formatted_usd: string;
  formatted_currency_symbol: string;
  currency_code: string;
  usd_value: number;
}

export interface CarComparisonResponse {
  car: {
    name: string;
    brand: string;
    model: string;
    year: number;
    category: string;
    base_price_usd: number;
    image?: string;
  };
  countries: CountryComparisonData[];
  total_countries: number;
  last_updated: string;
  source: string;
}

export interface CountryDetails {
  country: {
    name: string;
    official_name: string;
    alpha2: string;
    alpha3: string;
    flag: string;
    flag_emoji: string;
    coat_of_arms?: string;
    capital: string;
    region: string;
    subregion: string;
    continents: string[];
    independent: boolean;
    un_member: boolean;
  };
  economy: {
    gdp: number;
    gdp_per_capita: number;
    gdp_growth_rate: number;
    inflation_rate: {
      yearly: number;
      monthly: number;
    };
    interest_rate: number;
    unemployment_rate: number;
    purchasing_power_index: number;
    welfare_score: number;
  };
  government: {
    president: string;
    finance_minister: string;
    government_type: string;
  };
  social: {
    population: number;
    birth_rate: number;
    migration_rate: number;
    median_age: number;
    education_index: number;
    life_expectancy?: number;
  };
  minimum_wage: {
    monthly: PriceInfo;
    yearly: PriceInfo;
    weekly: PriceInfo;
    hourly: PriceInfo;
  };
  currency: {
    code: string;
    name: string;
    symbol: string;
    usd_exchange_rate: number;
    change_24h_percentage: number;
    trend_30_days: Array<{ date: string; rate: number }>;
    trend_90_days: Array<{ date: string; rate: number }>;
  };
  geography: {
    area: number;
    latitude: number;
    longitude: number;
    landlocked: boolean;
    borders: string[];
    timezones: string[];
  };
  languages: string[];
  last_updated: string;
  source: string;
}

export interface CurrencyConversionResponse {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  change_24h_percentage: number;
  last_updated: string;
  source: string;
}

export interface CountryListItem {
  name: string;
  official_name: string;
  alpha2: string;
  alpha3: string;
  flag: string;
  flag_emoji: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  region: string;
  subregion: string;
  population: number;
  capital: string;
  languages: string[];
  timezones: string[];
}

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add credentials for CORS if needed
        credentials: 'omit',
      });
      
      // Check if response is ok
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }
      
      // Parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`Failed to parse JSON response: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
      
      return data;
    } catch (error) {
      // Handle network errors (server not running, CORS, etc.)
      if (error instanceof TypeError) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('failed')) {
          console.error(`Network error for ${endpoint}:`, error);
          const backendUrl = import.meta.env.DEV ? 'http://localhost:5001' : API_BASE_URL;
          throw new Error(
            `Unable to connect to the backend server. Please make sure the server is running at ${backendUrl}. ` +
            `You can start it by running: cd backend && npm run dev`
          );
        }
      }
      
      // Re-throw if it's already an Error with message
      if (error instanceof Error) {
        console.error(`API fetch error for ${endpoint}:`, error);
        throw error;
      }
      
      // Fallback for unknown errors
      console.error(`Unknown API error for ${endpoint}:`, error);
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  /**
   * Get car price comparison across all countries
   */
  async getCarComparison(carName: string): Promise<CarComparisonResponse> {
    return this.fetchApi<CarComparisonResponse>(`/car?name=${encodeURIComponent(carName)}`);
  }

  /**
   * Search for available cars
   */
  async searchCars(query: string): Promise<{ cars: any[]; total: number }> {
    if (!query) {
      return this.fetchApi<{ cars: any[]; total: number }>('/car/search');
    }
    return this.fetchApi<{ cars: any[]; total: number }>(`/car/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get detailed country information
   */
  async getCountryDetails(countryCode: string): Promise<CountryDetails> {
    return this.fetchApi<CountryDetails>(`/country/${countryCode}`);
  }

  /**
   * Get all countries for dropdown
   */
  async getAllCountries(): Promise<{ countries: CountryListItem[]; total: number }> {
    return this.fetchApi<{ countries: CountryListItem[]; total: number }>('/countries');
  }

  /**
   * Convert currency
   */
  async convertCurrency(from: string, to: string, amount: number = 1): Promise<CurrencyConversionResponse> {
    return this.fetchApi<CurrencyConversionResponse>(
      `/exchange?from=${from}&to=${to}&amount=${amount}`
    );
  }

  /**
   * Get all exchange rates
   */
  async getExchangeRates(): Promise<{ base: string; rates: Record<string, number> }> {
    return this.fetchApi<{ base: string; rates: Record<string, number> }>('/exchange/rates');
  }

  /**
   * Get car recommendations
   */
  async getCarRecommendations(carName: string): Promise<any> {
    return this.fetchApi<any>(`/recommendations?name=${encodeURIComponent(carName)}`);
  }
}

export const apiService = new ApiService();
