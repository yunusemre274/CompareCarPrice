import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5001'),
  DATABASE_URL: z.string(),
  MARKETCHECK_API_KEY: z.string().optional(),
  CARSXE_API_KEY: z.string().optional(),
  CARQUERY_API_KEY: z.string().optional(),
  EXCHANGE_RATE_API_KEY: z.string().optional(),
  WORLD_BANK_API_URL: z.string().default('https://api.worldbank.org/v2'),
  OECD_API_KEY: z.string().optional(),
  NUMBEO_API_KEY: z.string().optional(),
  IMF_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
export const isDevelopment = env.NODE_ENV === 'development';
