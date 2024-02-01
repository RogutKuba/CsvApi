import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const webhooksContract = c.router({
  stripeWebhook: {
    method: 'POST',
    path: '/stripe-webhooks',
    body: z.any(),
    responses: {
      200: z.object({
        processed: z.literal('ok'),
      }),
    },
    summary: 'Handle stripe webhooks',
    metadata: { auth: 'none' } as const,
  },
});
