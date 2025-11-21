import { createHttpClient } from '../lib/httpClient.js';
import { env } from '../config/env.js';

const BASE_URL = 'https://marketcheck-prod.apigee.net/v2';

const client = createHttpClient(BASE_URL, {
  'Content-Type': 'application/json'
});

export interface MarketCheckListing {
  id: string;
  heading: string;
  price: number;
  miles: number;
  vdp_url: string;
  inventory_type: 'used' | 'new';
  dealer: {
    city: string;
    state: string;
    country: string;
  };
  media?: {
    photo_links?: string[];
  };
}

export interface MarketCheckResponse {
  num_found: number;
  listings: MarketCheckListing[];
}

const apiKey = env.MARKETCHECK_API_KEY;

export const fetchListings = async (params: Record<string, string | number>) => {
  if (!apiKey) throw new Error('MARKETCHECK_API_KEY not configured');
  const searchParams = new URLSearchParams({ key: apiKey });
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value.toString());
  });

  const { data } = await client.get<MarketCheckResponse>(`/search/listings?${searchParams.toString()}`);
  return data;
};
