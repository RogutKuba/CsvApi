import { jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import type {
  AuthResponse,
  WorkOsUser,
} from '@billing/backend-common/services/Auth/auth.types';
import { env } from '@billing/backend-common/env';
import { generateId } from '@billing/base';
import { DbClient } from '@billing/database';
import { usersTable, UserEntity } from '@billing/database/schemas/users.db';
import {
  AccountEntity,
  accountsTable,
} from '@billing/database/schemas/accounts.db';
import { createStripeService } from '../Stripe/Stripe.service';
import { ServerError } from '@billing/backend-common/errors/serverError';
import { subscriptionPlansTable } from '@billing/database/schemas/subscriptionPlan.db';
import dayjs from 'dayjs';
import { AuthCreationError } from './auth.errors';
import { logger } from '@billing/logger';

// Get secret
const secret = new Uint8Array(Buffer.from(env.JWT_SECRET_KEY, 'base64'));

export const AuthService = {
  validateAuth: async (authToken: string): Promise<WorkOsUser> => {
    const verifiedToken = await jwtVerify(authToken, secret);
    return verifiedToken.payload.user as WorkOsUser;
  },
  createOrGetUser: async (params: {
    workOsUser: WorkOsUser;
    db: DbClient;
  }): Promise<AuthResponse> => {
    const { workOsUser, db } = params;

    const userData = await db.query.usersTable.findFirst({
      where: eq(usersTable.workOsId, workOsUser.id),
      with: {
        account: {
          with: {
            subscriptionPlan: true,
          },
        },
      },
    });

    if (userData) {
      const account = userData.account;

      if (account.subscriptionPlan === null) {
        throw new ServerError({
          message: 'User has no valid subscription plan!',
        });
      }

      return {
        user: userData,
        account: account as AuthResponse['account'], // bad casting but should be valid type
      };
    }

    return AuthService.createNewUser({ workOsUser, db });
  },
  createNewUser: async (params: {
    workOsUser: WorkOsUser;
    db: DbClient;
  }): Promise<AuthResponse> => {
    const { workOsUser, db } = params;

    try {
      const stripeService = createStripeService();
      const accountId = generateId('account');

      // create new account and user
      const newAccount: AccountEntity = {
        id: accountId,
        createdAt: new Date().toISOString(),
        stripeCustomerId: await stripeService.createStripeCustomer({
          accountId,
        }),
        stripeProductId: 'free-plan',
        numApis: 0,
        numRequests: 0,
        numRequestsExpiryDate: dayjs().toISOString(),
      };

      const newUser: UserEntity = {
        id: generateId('user'),
        createdAt: new Date().toISOString(),
        workOsId: workOsUser.id,
        accountId,
        email: workOsUser.email,
        firstName: workOsUser.firstName,
        lastName: workOsUser.lastName,
      };

      const freePlan = await db.query.subscriptionPlansTable.findFirst({
        where: eq(subscriptionPlansTable.stripeProductId, 'free-plan'),
      });

      if (!freePlan) {
        throw new ServerError({ message: 'Cant find free plan!' });
      }

      // insert into db
      await db.transaction(async (tx) => {
        await tx.insert(accountsTable).values(newAccount);
        await tx.insert(usersTable).values(newUser);
      });

      return {
        user: newUser,
        account: {
          ...newAccount,
          subscriptionPlan: freePlan,
        },
      };
    } catch (e: unknown) {
      // check if it was duplicate key error by refetching
      const refetch = await db.query.usersTable.findFirst({
        where: eq(usersTable.workOsId, workOsUser.id),
      });
      if (refetch) {
        return AuthService.createOrGetUser({ workOsUser, db });
      }

      logger.error('error', e);
      throw new AuthCreationError({
        redirect: '',
        reason: 'Error creating user!',
      });
    }
  },
};
