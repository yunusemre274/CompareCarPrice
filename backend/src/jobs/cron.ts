import cron from 'node-cron';
import { ingestCarCatalog } from '../services/carIngestionService.js';
import { logger } from '../lib/logger.js';

export const registerCronJobs = () => {
  logger.info('Registering ingestion cron jobs');

  // Run car ingestion every night at 02:00
  cron.schedule('0 2 * * *', async () => {
    logger.info('Cron: car ingestion started');
    try {
      await ingestCarCatalog();
      logger.info('Cron: car ingestion finished');
    } catch (error) {
      logger.error({ err: error }, 'Cron: car ingestion failed');
    }
  });
};
