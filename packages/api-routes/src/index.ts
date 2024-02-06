import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { apiMethodsContract } from './contracts/apiMethodContract';
import { userContract } from './contracts/userContract';

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
  api: apiMethodsContract,
  user: userContract,
});

export { authContract } from './contracts/authContract';

export * from './models/rollup';
