import { ServerError } from '@billing/backend-common/errors/serverError';
import { logger } from '@billing/logger';
import Koa from 'koa';

/**
 * Handle koa errors
 */
export const useErrorMiddleware: () => Koa.Middleware = () => {
  const middleware: Koa.Middleware = async (ctx, next) => {
    try {
      await next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- used for generic error
    } catch (error: any) {
      const serverError =
        error instanceof ServerError
          ? error
          : new ServerError({
              title: 'Unkown Error',
              message: 'Something went wrong!',
              unknownErrorMessage: error.message, // eslint-disable-line @typescript-eslint/no-unsafe-member-access -- used for generic error
            });

      // should log error
      logger.error(serverError.getFriendlyError());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- used for generic error
      ctx.status =
        serverError.status || error.statusCode || error.status || 500; // eslint-disable-line @typescript-eslint/no-unsafe-member-access -- used for generic error
      error.status = ctx.status; // eslint-disable-line @typescript-eslint/no-unsafe-member-access -- used for generic error
      ctx.body = serverError.getFriendlyError();
      ctx.app.emit('error', error, ctx);
    }
  };

  return middleware;
};
