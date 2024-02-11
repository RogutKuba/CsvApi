import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';
import { accountsTable } from './accounts.db';
import { Id } from '@billing/base';
import { relations } from 'drizzle-orm';

export const apisTable = sqliteTable('apis', {
  ...getBaseProperties<'api'>('api'),
  accountId: text('accountId')
    .notNull()
    .references(() => accountsTable.id)
    .$type<Id<'account'>>(),
  fileName: text('fileName').notNull(),
  fileKey: text('fileKey').notNull().$type<Id<'file'>>(),
  isActive: int('isActive').notNull().default(1),
  schema: text('schema', { mode: 'json' })
    .notNull()
    .$type<{ field: string; type: string }[]>(),
  fieldDelimeterSpace: int('fieldDelimeterSpace').notNull(),
});

export const apisRelations = relations(apisTable, ({ one }) => ({
  account: one(accountsTable),
}));

export type ApiEntity = typeof apisTable.$inferSelect;
