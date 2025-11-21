import { ingestCarCatalog } from '../services/carIngestionService.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

(async () => {
  try {
    logger.info('Starting seed ingestion');
    await ingestCarCatalog({ modelLimit: 3, trimLimit: 3 });
    logger.info('Seed ingestion completed');
  } catch (error) {
    logger.error({ err: error }, 'Seed ingestion failed');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
