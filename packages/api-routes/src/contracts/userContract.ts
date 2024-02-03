import { initContract } from '@ts-rest/core';
import {
  AccountModel,
  SubscriptionPlanModel,
  UserModel,
} from '../models/Auth.model';
import { z } from 'zod';

const c = initContract();

export const userContract = c.router({
  getUser: {
    method: 'GET',
    path: '/user',
    responses: {
      200: z.object({
        user: UserModel,
        account: AccountModel,
        subscriptionPlan: SubscriptionPlanModel,
      }),
    },
    summary: 'Get current user details',
  },
});
