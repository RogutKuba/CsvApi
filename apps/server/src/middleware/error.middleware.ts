import { AuthService } from '@billing/backend-common/services/Auth/Auth.service';
import { InvalidAuthError } from '@billing/backend-common/services/Auth/auth.errors';
import { logger } from '@billing/logger';
import { createMiddleware } from 'hono/factory';

export const errorMiddleWare = createMiddleware(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);

    ctx.text('error');
  }
});
