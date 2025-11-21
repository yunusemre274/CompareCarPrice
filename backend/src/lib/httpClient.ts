import axios, { AxiosInstance } from 'axios';
import { logger } from './logger.js';

export const createHttpClient = (baseURL: string, headers: Record<string, string> = {}): AxiosInstance => {
  const client = axios.create({ baseURL, headers, timeout: 15000 });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      logger.error({ err: error, baseURL }, 'HTTP client error');
      return Promise.reject(error);
    }
  );

  return client;
};
