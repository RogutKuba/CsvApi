import { int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';

export const subscriptionPlansTable = sqliteTable(
  'subscriptionPlans',
  {
    ...getBaseProperties<'subscriptionPlan'>('subscriptionPlan'),
    stripeProductId: text('stripeProductId').notNull().unique(),
    allowedApis: int('allowedApis').notNull(),
    allowedRequests: int('allowedRequests').notNull(),
    features: text('features', { mode: 'json' }).notNull().$type<string[]>(),
  },
  (table) => {
    return {
      stripeProductIdIndex: uniqueIndex('stripeProdIdIndex').on(
        table.stripeProductId
      ),
    };
  }
);

export type SubscriptionPlanEntity = typeof subscriptionPlansTable.$inferSelect;
