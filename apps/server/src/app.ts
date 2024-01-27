import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { logger as customLogger } from '@billing/logger';
import { appContract } from '@billing/api-routes';
import { handlers } from './handlers';
import { createHonoEndpoints } from 'ts-rest-hono';
import { HonoEnv } from './context';
import { authMiddleware } from './middleware/auth.middleware';

export const app = new Hono<HonoEnv>({});

app.use('*', logger(customLogger.log));
app.use('*', authMiddleware);

createHonoEndpoints(appContract, handlers, app);
