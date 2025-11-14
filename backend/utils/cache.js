import NodeCache from 'node-cache';

// Cache TTL in seconds (default 10 minutes)
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS) || 600;

// Create cache instance
const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: 120,
  useClones: false
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {any|null} Cached value or null
 */
export const get = (key) => {
  try {
    const value = cache.get(key);
    return value || null;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} Success status
 */
export const set = (key, value, ttl = CACHE_TTL) => {
  try {
    return cache.set(key, value, ttl);
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete value from cache
 * @param {string} key - Cache key
 * @returns {number} Number of deleted entries
 */
export const del = (key) => {
  try {
    return cache.del(key);
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Clear entire cache
 */
export const flush = () => {
  try {
    cache.flushAll();
    console.log('Cache flushed successfully');
  } catch (error) {
    console.error('Cache flush error:', error);
  }
};

/**
 * Get cache statistics
 */
export const getStats = () => {
  return cache.getStats();
};

export default {
  get,
  set,
  del,
  flush,
  getStats
};
