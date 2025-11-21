import { createRequire } from 'node:module';
import { registerCronJobs } from './jobs/cron.js';

/**
 * Temporary bridge: loads the existing JavaScript Express server while
 * we migrate to the new TypeScript codebase. All new TypeScript modules
 * (Prisma, jobs, services) live alongside this file and will gradually
 * replace the legacy implementation.
 */
registerCronJobs();

const require = createRequire(import.meta.url);
require('../server.js');
