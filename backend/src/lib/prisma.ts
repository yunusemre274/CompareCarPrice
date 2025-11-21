import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino({
  name: 'prisma',
  level: process.env.LOG_LEVEL || 'info'
});

export const prisma = new PrismaClient({
  log: ['warn', 'error']
});

process.on('beforeExit', async () => {
  logger.info('Prisma client disconnect');
  await prisma.$disconnect().catch((error: unknown) => {
    logger.error({ err: error }, 'Failed to disconnect prisma');
  });
});
