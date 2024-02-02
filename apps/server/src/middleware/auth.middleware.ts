import { ServerError } from '@billing/backend-common/errors/serverError';
import { AuthService } from '@billing/backend-common/services/Auth/Auth.service';
import { InvalidAuthError } from '@billing/backend-common/services/Auth/auth.errors';
import { db } from '@billing/database/db';
import { logger } from '@billing/logger';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

const UNAUTHED_ROUTES = ['/health', '/stripe-webhooks', '/error'];

export const authMiddleware = createMiddleware(async (ctx, next) => {
  if (UNAUTHED_ROUTES.includes(ctx.req.path)) {
    await next();
  } else {
    // check if the user is authenticated and cookie exists
    try {
      const authTokenRaw = ctx.req.raw.headers.get('Authorization');

      if (!authTokenRaw) {
        logger.error('No auth token found');
        throw new InvalidAuthError({
          reason: 'no-token-found',
          redirect: '/login',
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
            redirect: '/login',
          });
        }
      })();

      // if we validated the jwt we should have a user stored in our database
      const { user } = await AuthService.createOrGetUser({ workOsUser, db });

      ctx.set('workOsUser', workOsUser);
      ctx.set('user', user);

      await next();
    } catch (e: any) {
      logger.error('auth error', e);

      if (e instanceof ServerError) {
        ctx.status(e.status);

        if (e.meta['redirect'] && e.meta['redirect'] !== '') {
          console.log('redirect', e.meta['redirect']);
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
