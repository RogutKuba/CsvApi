import { Context } from 'hono';
import { HonoEnv } from '../context';
import { ServerError } from '@billing/backend-common/errors/serverError';

export const errorMiddleWare = async (
  e: unknown,
  ctx: Context<HonoEnv> | undefined
) => {
  if (e instanceof ServerError && ctx) {
    ctx.error = e as ServerError;
  }
};
