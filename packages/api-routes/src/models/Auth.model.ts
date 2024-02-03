import { z } from 'zod';

export const UserModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  accountId: z.string(),
  workOsId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const AccountModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  stripeCustomerId: z.string(),
  stripeProductId: z.string(),
  numApis: z.number(),
  numRequests: z.number(),
});

export const SubscriptionPlanModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  stripeProductId: z.string(),
  allowedApis: z.number(),
  allowedRequests: z.number(),
  features: z.array(z.string()),
});
