import { logger } from '@billing/logger';
import type Koa from 'koa';

/**
 * Log every http request to the console
 */
export const useLoggerMiddleware: () => Koa.Middleware = () => {
  const middleware: Koa.Middleware = async (ctx, next) => {
    logger.log(`HTTP Request: ${ctx.method} ${ctx.url}`);
    await next();
  };

  return middleware;
};
