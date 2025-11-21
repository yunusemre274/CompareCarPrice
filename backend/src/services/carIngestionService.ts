import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { fetchModelsByMake, fetchTrims, CarQueryTrim } from '../clients/carQueryClient.js';
import { fetchListings } from '../clients/marketCheckClient.js';
import { env } from '../config/env.js';

const DEFAULT_BRANDS = ['Toyota', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Tesla'];
const DEFAULT_COUNTRIES = [
  { code: 'US', currency: 'USD' },
  { code: 'GB', currency: 'GBP' },
  { code: 'DE', currency: 'EUR' }
];

export interface IngestionOptions {
  brands?: string[];
  year?: number;
  modelLimit?: number;
  trimLimit?: number;
}

const toNumber = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeTrim = (trim: CarQueryTrim) => ({
  year: Number(trim.model_year) || new Date().getFullYear(),
  name: trim.model_trim || trim.model_name,
  enginePowerHp: toNumber(trim.model_engine_power_ps),
  torqueNm: toNumber(trim.model_engine_torque_nm),
  fuelType: trim.model_engine_fuel || undefined,
  transmission: trim.model_transmission_type || undefined,
  fuelCityL100: toNumber(trim.model_lkm_city),
  fuelHwyL100: toNumber(trim.model_lkm_hwy),
  displacementL: toNumber(trim.model_engine_l),
  drivetrain: trim.model_drive || undefined,
  specs: trim
});

const ensureBrand = async (name: string, country?: string) => {
  const existing = await prisma.carBrand.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.carBrand.create({ data: { name, country } });
};

const ensureCar = async (brandId: string, model: string, baseYear: number) => {
  const existing = await prisma.car.findFirst({ where: { brandId, model } });
  if (existing) return existing;
  return prisma.car.create({ data: { brandId, model, baseYear } });
};

const ensureTrim = async (carId: string, normalized: ReturnType<typeof normalizeTrim>) => {
  const existing = await prisma.carTrim.findFirst({
    where: { carId, name: normalized.name, year: normalized.year }
  });

  if (existing) {
    return prisma.carTrim.update({
      where: { id: existing.id },
      data: normalized
    });
  }

  return prisma.carTrim.create({
    data: {
      carId,
      ...(normalized as any)
    }
  });
};

const upsertPrice = async (
  carTrimId: string,
  countryCode: string,
  amountUsd: number,
  type: 'NEW' | 'USED'
) => {
  const existing = await prisma.carPrice.findFirst({
    where: { carTrimId, countryCode, priceType: type }
  });

  if (existing) {
    return prisma.carPrice.update({
      where: { id: existing.id },
      data: { amountUsd, listedAt: new Date() }
    });
  }

  return prisma.carPrice.create({
    data: {
      carTrimId,
      countryCode,
      priceType: type,
      amountUsd,
      source: env.MARKETCHECK_API_KEY ? 'marketcheck' : 'synthetic'
    }
  });
};

const ingestPricesForTrim = async (brand: string, model: string, trimName: string, carTrimId: string) => {
  try {
    if (!env.MARKETCHECK_API_KEY) {
      // Synthetic fallback: create pseudo prices for demo/testing
      const basePrice = 30000 + Math.random() * 20000;
      await Promise.all(
        DEFAULT_COUNTRIES.map((country) =>
          upsertPrice(carTrimId, country.code, Number((basePrice * (1 + Math.random())).toFixed(0)), 'NEW')
        )
      );
      return;
    }

    const response = await fetchListings({ make: brand, model, rows: 50, trim: trimName });
    if (!response.listings?.length) return;

    await Promise.all(
      response.listings.map((listing) =>
        upsertPrice(
          carTrimId,
          listing.dealer.country || 'US',
          listing.price,
          listing.inventory_type === 'new' ? 'NEW' : 'USED'
        )
      )
    );
  } catch (error) {
    logger.error({ err: error, brand, model }, 'Failed to ingest prices for trim');
  }
};

export const ingestCarCatalog = async (options: IngestionOptions = {}) => {
  const {
    brands = DEFAULT_BRANDS,
    year = new Date().getFullYear(),
    modelLimit = 5,
    trimLimit = 5
  } = options;

  for (const brand of brands) {
    logger.info({ brand }, 'Ingesting brand');
    try {
      const brandRecord = await ensureBrand(brand);
      const models = await fetchModelsByMake(brand, year);
      const limitedModels = models.slice(0, modelLimit);

      for (const model of limitedModels) {
        const carRecord = await ensureCar(brandRecord.id, model.model_name, Number(model.model_year) || year);
        const trims = await fetchTrims(brand, model.model_name, Number(model.model_year) || year);
        const limitedTrims = trims.slice(0, trimLimit);

        for (const trim of limitedTrims) {
          const normalized = normalizeTrim(trim);
          const carTrim = await ensureTrim(carRecord.id, normalized);
          await ingestPricesForTrim(brand, model.model_name, normalized.name, carTrim.id);
        }
      }
    } catch (error) {
      logger.error({ err: error, brand }, 'Failed to ingest brand');
    }
  }

  logger.info('Car ingestion finished');
};
