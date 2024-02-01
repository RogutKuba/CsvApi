import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { logger as customLogger } from '@billing/logger';
import { appContract } from '@billing/api-routes';
import { handlers } from './handlers';
import { createHonoEndpoints } from 'ts-rest-hono';
import { HonoEnv } from './context';
import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleWare } from './middleware/error.middleware';
import { webhookApp } from './handlers/webhookHandlers';

export const app = new Hono<HonoEnv>({});

// Stripe handler needs to be separate becauase of body parsing issue
app.route('/webhooks', webhookApp);

app.use('*', logger(customLogger.log));
app.use('*', authMiddleware);
app.use('*', errorMiddleWare);

createHonoEndpoints(appContract, handlers, app);
