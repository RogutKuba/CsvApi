import { createError } from '@billing/backend-common/errors/createError';

const base = createError({ name: 'ServerAppError' });

export const BadRequestError = base.createError({
  name: 'BadRequestError',
  status: 400,
  messageData: {
    message: 'Bad request',
  },
});
