import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { apiMethodsCntract } from './apiMethodRouter';

const c = initContract();

export const appContract = c.router({
  health: {
    method: 'GET',
    path: '/health',
    responses: {
      200: z.object({
        status: z.literal('ok'),
      }),
    },
    summary: 'Health check',
  },
  api: apiMethodsCntract,
});
