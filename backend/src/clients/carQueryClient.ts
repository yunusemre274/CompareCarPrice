import { createHttpClient } from '../lib/httpClient.js';
import { env } from '../config/env.js';

const BASE_URL = 'https://www.carqueryapi.com/api/0.3/';
const client = createHttpClient(BASE_URL);

type CarQueryResponse<T> = {
  [key: string]: T;
};

export interface CarQueryMake {
  make_id: string;
  make_display: string;
  make_is_common: string;
  make_country: string;
}

export interface CarQueryModel {
  model_name: string;
  model_make_id: string;
  model_year: string;
}

export interface CarQueryTrim {
  model_year: string;
  model_name: string;
  model_trim: string;
  model_body: string;
  model_engine_fuel: string;
  model_engine_power_ps: string;
  model_engine_torque_nm: string;
  model_drive: string;
  model_transmission_type: string;
  model_engine_fuel_cap_l: string;
  model_engine_l: string;
  model_lkm_city: string;
  model_lkm_hwy: string;
  model_make_id: string;
}

const withParams = (params: Record<string, string | number>) => {
  const url = new URL(BASE_URL);
  url.searchParams.set('callback', '?');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value.toString());
  });
  return url.toString().replace('%3F', '');
};

export const fetchMakes = async (): Promise<CarQueryMake[]> => {
  const url = withParams({ cmd: 'getMakes' });
  const { data } = await client.get<CarQueryResponse<CarQueryMake[]>>(url);
  return data.Makes || [];
};

export const fetchModelsByMake = async (make: string, year?: number): Promise<CarQueryModel[]> => {
  const params: Record<string, string | number> = { cmd: 'getModels', make }; 
  if (year) params.year = year;
  const url = withParams(params);
  const { data } = await client.get<CarQueryResponse<CarQueryModel[]>>(url);
  return data.Models || [];
};

export const fetchTrims = async (make: string, model: string, year?: number): Promise<CarQueryTrim[]> => {
  const params: Record<string, string | number> = { cmd: 'getTrims', make, model }; 
  if (year) params.year = year;
  const url = withParams(params);
  const { data } = await client.get<CarQueryResponse<CarQueryTrim[]>>(url);
  return data.Trims || [];
};

export const carQueryKey = env.CARQUERY_API_KEY;
