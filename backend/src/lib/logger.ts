import pino from 'pino';
import { isDevelopment } from '../config/env.js';

const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      }
    }
  : undefined;

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport
});
