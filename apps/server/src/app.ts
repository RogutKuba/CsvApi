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
import { cors } from 'hono/cors';
import { ServerError } from '@billing/backend-common/errors/serverError';

export const app = new Hono<HonoEnv>({});

// Stripe handler needs to be separate becauase of body parsing issue
app.route('/webhooks', webhookApp);

app.use('*', cors());
app.use('*', logger(customLogger.log));
app.use('*', authMiddleware);
// app.use('*', errorMiddleWare);

createHonoEndpoints(appContract, handlers, app, {
  errorHandler: errorMiddleWare,
});

app.onError((err, ctx) => {
  console.error('error 123', err);

  ctx.status(500);
  return ctx.json({
    error: 'Internal Server Error',
  });
});

app.notFound((ctx) => {
  if (ctx.error) {
    if (ctx.error instanceof ServerError) {
      ctx.status(ctx.error.status);
      return ctx.json({ message: ctx.error._message, title: ctx.error._title });
    }
  }

  ctx.status(404);
  return ctx.json({
    error: 'Not Found',
  });
});

app.showRoutes();
