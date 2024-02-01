import { createError } from '@billing/backend-common/errors/createError';

const base = createError({ name: 'LimitError' });

export const LimitReachedError = base.createError({
  name: 'LimitReachedError',
  status: 429,
  messageData: {
    title: 'Reached limit of plan',
    message: 'Upgrade your plan for more capacity',
  },
});
