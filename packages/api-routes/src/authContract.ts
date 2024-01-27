import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const authContract = c.router({
  authRedirect: {
    method: 'GET',
    path: '/auth',
    responses: {
      302: z.object({
        redirect: z.string(),
      }),
    },
    summary: 'Redirect to WorkOs auth page',
  },
});
