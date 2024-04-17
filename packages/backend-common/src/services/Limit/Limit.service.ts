import { DbClient } from '@billing/database/db';
import { AuthResponse } from '../Auth/auth.types';
import { LimitReachedError } from './Limit.errors';
import dayjs from 'dayjs';
import { and, count, eq, gte, sql } from 'drizzle-orm';
import { requestLogsTable } from '@billing/database/schemas/requestLog.db';
import { accountsTable } from '@billing/database/schemas/accounts.db';
import { Id } from '@billing/base';
import { HTTPException } from 'hono/http-exception';

export const LimitService = {
  assertNumberApis: async (params: {
    account: AuthResponse['account'];
  }): Promise<boolean> => {
    // assert under api limit for free plan
    const { account } = params;

    const curNum = account.numApis;
    const limit = account.subscriptionPlan.allowedApis;

    if (curNum >= limit) {
      const errorResponse = new Response('Unauthorized', {
        status: 401,
        headers: {
          Authenticate: 'error="invalid_token"',
        },
      });
      // throw new HTTPException(401, { res: errorResponse });

      throw new LimitReachedError({
        curApis: curNum,
        limit,
        accountId: account.id,
        type: 'api-limit',
      });
    }

    return true;
  },
  assertRequests: async (params: {
    account: AuthResponse['account'];
    db: DbClient;
  }): Promise<boolean> => {
    // assert under request limit for free plan
    const { account, db } = params;

    const curNum = account.numRequests;
    const limit = account.subscriptionPlan.allowedRequests;
    const expiryDate = dayjs(account.numRequestsExpiryDate);

    // error out fast if over limit and expiry date is in future
    if (curNum >= limit && expiryDate.isAfter(dayjs())) {
      throw new LimitReachedError({
        curApis: curNum,
        limit,
        accountId: account.id,
        expiryDate: expiryDate.toISOString(),
        type: 'req-limit',
      });
    }

      // Remove random number check and always update request count
      await LimitService.updateRequestsCount({
          account,
          db,
      });

    return true;
  },
  updateRequestsCount: async (params: {
    account: AuthResponse['account'];
    db: DbClient;
  }) => {
    const { account, db } = params;
    // update request counter every 10ish requests or after expiry time
    const monthStartDate = dayjs().startOf('month').toISOString();
    const monthEndDate = dayjs().endOf('month').toISOString();

    const rawResult = await db
      .select({ value: count() })
      .from(requestLogsTable)
      .where(
        and(
          eq(requestLogsTable.accountId, account.id),
          gte(requestLogsTable.createdAt, monthStartDate)
        )
      );

    const { value: logCount } = rawResult[0];

    await db
      .update(accountsTable)
      .set({ numRequests: logCount, numRequestsExpiryDate: monthEndDate })
      .where(eq(accountsTable.id, account.id));
  },
  updateApiCount: async (params: {
    accountId: Id<'account'>;
    num: number;
    db: DbClient;
  }) => {
    const { accountId, num, db } = params;

    await db
      .update(accountsTable)
      .set({ numApis: sql`${accountsTable.numApis} + ${num}` })
      .where(eq(accountsTable.id, accountId));
  },
};
