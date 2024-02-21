import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';
import { relations } from 'drizzle-orm';
import { usersTable } from './users.db';
import { subscriptionPlansTable } from './subscriptionPlan.db';
import { apisTable } from './api.db';

export const accountsTable = sqliteTable('accounts', {
  ...getBaseProperties<'account'>('account'),
  stripeCustomerId: text('stripeCustomerId').default('test').notNull(),
  stripeProductId: text('stripeSubscriptionId').default('free-plan').notNull(),
  // .references(() => subscriptionPlansTable.stripeProductId),
  numApis: int('numApis').default(0).notNull(),
  numRequests: int('numRequests').default(0).notNull(),
  numRequestsExpiryDate: text('numRequestsExpiryDate').default('').notNull(),
});

export const accountsRelations = relations(accountsTable, ({ many, one }) => ({
  users: many(usersTable),
  apis: many(apisTable),
  subscriptionPlan: one(subscriptionPlansTable, {
    fields: [accountsTable.stripeProductId],
    references: [subscriptionPlansTable.stripeProductId],
  }),
}));

export type AccountEntity = typeof accountsTable.$inferSelect;
