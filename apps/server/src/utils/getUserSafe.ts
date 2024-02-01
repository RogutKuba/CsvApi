import { Context } from 'hono';
import { HonoEnv } from '../context';
import { ServerError } from '@billing/backend-common/errors/serverError';

export const getUserSafe = (ctx: Context<HonoEnv, any, {}>) => {
  const user = ctx.get('user');

  if (!user) {
    throw new ServerError({ message: 'User is undefined!' });
  }

  return user;
};
