/**
 * Format currency value with symbol and proper formatting
 * @param {number} value - Numeric value
 * @param {string} currencyCode - ISO currency code (e.g., 'USD', 'EUR')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currencyCode = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currencyCode} ${value.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }
};

/**
 * Format number with thousands separator
 * @param {number} value - Numeric value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

/**
 * Get currency symbol from currency code
 * @param {string} currencyCode - ISO currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'RUB': '₽',
    'KRW': '₩',
    'BRL': 'R$',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'SEK': 'kr',
    'NZD': 'NZ$',
    'MXN': 'MX$',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NOK': 'kr',
    'TRY': '₺',
    'ZAR': 'R',
    'AED': 'د.إ',
    'SAR': '﷼',
    'PLN': 'zł',
    'THB': '฿'
  };

  return symbols[currencyCode] || currencyCode;
};

/**
 * Convert currency using exchange rate
 * @param {number} amount - Amount to convert
 * @param {number} rate - Exchange rate
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, rate) => {
  if (!amount || !rate) return 0;
  return amount * rate;
};

/**
 * Format currency for API response
 * @param {number} value - Numeric value
 * @param {string} currencyCode - Currency code
 * @param {number} usdRate - Exchange rate to USD
 * @returns {object} Formatted currency object
 */
export const formatCurrencyResponse = (value, currencyCode, usdRate = 1) => {
  const usdValue = convertCurrency(value, usdRate);
  
  return {
    value: value,
    formatted_value_local: formatCurrency(value, currencyCode),
    formatted_usd: formatCurrency(usdValue, 'USD'),
    formatted_currency_symbol: getCurrencySymbol(currencyCode),
    currency_code: currencyCode,
    usd_value: parseFloat(usdValue.toFixed(2))
  };
};

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(decimals)}%`;
};

export default {
  formatCurrency,
  formatNumber,
  getCurrencySymbol,
  convertCurrency,
  formatCurrencyResponse,
  calculatePercentageChange,
  formatPercentage
};
