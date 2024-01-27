import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';
import { accountsTable } from './accounts.db';
import { z } from 'zod';

export const apisTable = sqliteTable('apis', {
  ...getBaseProperties('api'),
  accountId: text('accountId')
    .notNull()
    .references(() => accountsTable.id),
  fileKey: text('fileKey').notNull(),
  isActive: int('isActive').notNull().default(1),
});

export type ApiEntity = typeof apisTable.$inferSelect;
export const ApiModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  accountId: z.string(),
  fileKey: z.string(),
  isActive: z.boolean(),
});
