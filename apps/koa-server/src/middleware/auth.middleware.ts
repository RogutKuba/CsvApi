import { InvalidAuthError } from '@billing/backend-common/services/Auth/auth.errors';
import { AuthService } from '@billing/backend-common/services/Auth/auth.main';
import { logger } from '@billing/logger';
import { specFactory } from '@server/specFactory';

export const authMiddleware = specFactory.createUseSpec({
  handler: async (ctx, next) => {
    // check if the user is authenticated and cookie exists
    try {
      const authCookie = ctx.cookies.get('x-auth-token');

      if (!authCookie) {
        logger.error('No auth cookie found');
        throw new InvalidAuthError();
      }

      const workOsUser = await AuthService.validateAuth(authCookie);
      const user = await AuthService.createOrGetUser(workOsUser);

      ctx.state.workOsuser = workOsUser;
      ctx.state.user = user;
      await next();
    } catch {
      // redirect to login
      ctx.status = 302;
      ctx.body = {
        redirect: '/login',
      };
    }
  },
});
