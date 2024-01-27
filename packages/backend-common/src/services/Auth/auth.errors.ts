import { createError } from '@billing/backend-common/errors/createError';

const base = createError({ name: 'AuthError' });

export const InvalidAuthError = base.createError({
  name: 'InvalidAuthError',
  status: 401,
  messageData: {
    title: 'Invalid auth',
    message: 'Missing auth token or invalid auth token',
  },
});
