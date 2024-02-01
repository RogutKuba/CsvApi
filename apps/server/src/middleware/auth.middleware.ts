import { AuthService } from '@billing/backend-common/services/Auth/Auth.service';
import { InvalidAuthError } from '@billing/backend-common/services/Auth/auth.errors';
import { logger } from '@billing/logger';
import { createMiddleware } from 'hono/factory';

const UNAUTHED_ROUTES = ['/health', '/stripe-webhooks'];

export const authMiddleware = createMiddleware(async (ctx, next) => {
  if (UNAUTHED_ROUTES.includes(ctx.req.path)) {
    await next();
  } else {
    // check if the user is authenticated and cookie exists
    try {
      const authTokenRaw = ctx.req.raw.headers.get('Authorization');

      if (!authTokenRaw) {
        logger.error('No auth token found');
        throw new InvalidAuthError({ reason: 'no-token-found' });
      }
      const authToken = authTokenRaw.replace('Bearer ', '');

      const workOsUser = await (async () => {
        try {
          const res = await AuthService.validateAuth(authToken);
          return res;
        } catch {
          throw new InvalidAuthError({ reason: 'invalid-jwt' });
        }
      })();

      // if we validated the jwt we should have a user stored in our database
      const { user } = await AuthService.createOrGetUser(workOsUser);

      ctx.set('workOsUser', workOsUser);
      ctx.set('user', user);

      await next();
    } catch (e) {
      logger.error('auth error', e);
      // redirect to login
      ctx.status(302);
      return ctx.json({
        redirect: '/login',
      });
    }
  }
});
