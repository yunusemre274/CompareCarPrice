import { createHttpClient } from '../lib/httpClient.js';
import { env } from '../config/env.js';

const BASE_URL = 'https://api.carsxe.com';
const apiKey = env.CARSXE_API_KEY;

const client = createHttpClient(BASE_URL);

export interface CarsXEVehicleResponse {
  specifications?: Record<string, unknown>;
  photos?: string[];
}

export const fetchVehicleByVin = async (vin: string): Promise<CarsXEVehicleResponse> => {
  if (!apiKey) {
    throw new Error('CARSXE_API_KEY not configured');
  }

  const { data } = await client.get<CarsXEVehicleResponse>('/specs', {
    params: {
      key: apiKey,
      vin
    }
  });

  return data;
};
