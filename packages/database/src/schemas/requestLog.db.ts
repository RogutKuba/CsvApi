import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getBaseProperties } from '../utils/baseProperties';
import { accountsTable } from './accounts.db';
import { apisTable } from './api.db';

export const requestLogsTable = sqliteTable(
  'requestLogs',
  {
    ...getBaseProperties('requestLog'),
    apiId: text('apiId')
      .notNull()
      .references(() => apisTable.id),
    accountId: text('accountId')
      .notNull()
      .references(() => accountsTable.id),
    rawQuery: text('rawQuery').notNull(),
  },
  (table) => {
    return {
      dateIdx: index('logDateIdx').on(table.createdAt),
      accountIdx: index('logAcctIdx').on(table.accountId),
    };
  }
);

export type RequestLogEntity = typeof requestLogsTable.$inferSelect;
