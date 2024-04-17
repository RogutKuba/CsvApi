import { ServerError } from '@billing/backend-common/errors/serverError';
import { AuthService } from '@billing/backend-common/services/Auth/Auth.service';
import { InvalidAuthError } from '@billing/backend-common/services/Auth/auth.errors';
import { db } from '@billing/database/db';
import { logger } from '@billing/logger';
import { createMiddleware } from 'hono/factory';

// const UNAUTHED_ROUTES = ['/health', '/stripe-webhooks', '/error', '/api'];

const UNAUTHED_ROUTES = [
  {
    path: '/health',
    method: 'GET',
  },
  {
    path: '/stripe-webhooks',
    method: 'POST',
  },
  {
    path: '/error',
    method: 'GET',
  },
  {
    path: '/api/:id',
    method: 'GET',
  },
  {
    path: '/favicon.ico',
    method: 'GET',
  },
];

export const authMiddleware = createMiddleware(async (ctx, next) => {
  const matchedRoutePath =
    ctx.req.matchedRoutes.find((route) => route.path !== '/*')?.path ??
    ctx.req.path;

  const unauthedRouteMatch =
    UNAUTHED_ROUTES.find(
      (route) =>
        route.path === matchedRoutePath && route.method === ctx.req.method
    ) !== undefined;

  if (unauthedRouteMatch) {
    await next();
  } else {
    // check if the user is authenticated and cookie exists
    try {
      const authTokenRaw = ctx.req.raw.headers.get('Authorization');

      if (!authTokenRaw) {
        logger.error('No auth token found');
        throw new InvalidAuthError({
          reason: 'no-token-found',
          redirect: '/app/login',
        });
      }
      const authToken = authTokenRaw.replace('Bearer ', '');

      const workOsUser = await (async () => {
        try {
          const res = await AuthService.validateAuth(authToken);
          return res;
        } catch {
          throw new InvalidAuthError({
            reason: 'invalid-jwt',
            redirect: '/app/login',
          });
        }
      })();

      // if we validated the jwt we should have a user stored in our database
      const { user } = await AuthService.createOrGetUser({ workOsUser, db });

      ctx.set('workOsUser', workOsUser);
      user.requestCount = (user.requestCount || 0) + 1;
      await db.user.update({ id: user.id, requestCount: user.requestCount });
      ctx.set('user', user);


      await next();
    } catch (e: any) {
      logger.error('auth error', e);

      if (e instanceof ServerError) {
        ctx.status(e.status);

        if (e.meta['redirect'] && e.meta['redirect'] !== '') {
          return ctx.json({
            redirect: e.meta['redirect'],
            type: e.errorType,
            message: e.message,
          });
        }
      }
      ctx.status(500);
      return ctx.json({
        type: 'Error',
        message: e.message,
      });
    }
  }
});
