import { Context } from 'hono';
import { HonoEnv } from '../context';
import { ServerError } from '@billing/backend-common/errors/serverError';
import { HTTPException } from 'hono/http-exception';

export const errorMiddleWare = async (
  e: unknown,
  ctx: Context<HonoEnv> | undefined
) => {
  console.log('try to return', !!ctx, e instanceof ServerError);
  if (e instanceof ServerError && ctx) {
    console.log('message', e.message);
    // throw new HTTPException(401, { message: 'hoh' });

    ctx.status(e.status);
    return ctx.json({
      message: e.message,
    });
  }

  console.log('ctx', !!ctx, e);

  return ctx?.json({ message: '123' });
};
