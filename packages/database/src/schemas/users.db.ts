import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';
import { accountsTable } from './accounts.db';
import { relations } from 'drizzle-orm';
import { Id } from '@billing/base';

export const usersTable = sqliteTable('users', {
  ...getBaseProperties<'user'>('user'),
  accountId: text('accountId')
    .notNull()
    // .references(() => accountsTable.id)
    .$type<Id<'account'>>(),
  workOsId: text('workOsId').notNull(),
  email: text('email').notNull(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [usersTable.accountId],
    references: [accountsTable.id],
  }),
}));

export type UserEntity = typeof usersTable.$inferSelect;
