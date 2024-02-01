import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';
import { relations } from 'drizzle-orm';
import { usersTable } from './users.db';

export const accountsTable = sqliteTable('accounts', {
  ...getBaseProperties<'account'>('account'),
  hasBucket: int('hasBucket').notNull().default(0),
  stripeCustomerId: text('stripeCustomerId').notNull(),
  numApis: int('numApis').notNull().default(0),
});

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  users: many(usersTable),
}));

export type AccountEntity = typeof accountsTable.$inferSelect;
