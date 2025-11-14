import axios from 'axios';
import * as cache from './cache.js';

/**
 * Fetch data from external API with caching
 * @param {string} url - API URL
 * @param {object} options - Axios options
 * @param {number} cacheTTL - Cache TTL in seconds (default: 600)
 * @returns {Promise<any>} API response data
 */
export const fetchWithCache = async (url, options = {}, cacheTTL = 600) => {
  const cacheKey = `api_${url}_${JSON.stringify(options)}`;
  
  // Try to get from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache HIT: ${url}`);
    return cachedData;
  }

  console.log(`Cache MISS: ${url}`);
  
  try {
    const response = await axios({
      url,
      timeout: 10000,
      ...options
    });

    const data = response.data;
    
    // Cache the response
    cache.set(cacheKey, data, cacheTTL);
    
    return data;
  } catch (error) {
    console.error(`API fetch error for ${url}:`, error.message);
    
    // Try to return stale cache if available
    const staleCache = cache.get(cacheKey);
    if (staleCache) {
      console.log(`Returning stale cache for ${url}`);
      return staleCache;
    }
    
    throw error;
  }
};

/**
 * Fetch data without caching
 * @param {string} url - API URL
 * @param {object} options - Axios options
 * @returns {Promise<any>} API response data
 */
export const fetch = async (url, options = {}) => {
  try {
    const response = await axios({
      url,
      timeout: 10000,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error(`API fetch error for ${url}:`, error.message);
    throw error;
  }
};

/**
 * Fetch multiple URLs in parallel
 * @param {Array<string>} urls - Array of URLs
 * @param {number} cacheTTL - Cache TTL in seconds
 * @returns {Promise<Array>} Array of responses
 */
export const fetchMultiple = async (urls, cacheTTL = 600) => {
  const promises = urls.map(url => fetchWithCache(url, {}, cacheTTL));
  return Promise.allSettled(promises);
};

export default {
  fetchWithCache,
  fetch,
  fetchMultiple
};
