import { createError } from '@billing/backend-common/errors/createError';

const base = createError({ name: 'AuthError' });

export const InvalidAuthError = base.createError({
  name: 'InvalidAuthError',
  status: 401,
  messageData: {
    title: 'Invalid auth',
    message: 'Missing auth token or invalid auth token',
    meta: {
      redirect: '',
      reason: '',
    },
  },
});

export const AuthCreationError = base.createError({
  name: 'UserCreationError',
  status: 500,
  messageData: {
    title: 'Error creating user',
    message: 'Unhandled error creating user',
    meta: {
      redirect: '',
      reason: '',
    },
  },
});
