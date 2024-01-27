import { db } from '@billing/database/db';
import type { UserEntity } from '@billing/database/schemas/users.db';
import { usersTable } from '@billing/database/schemas/users.db';
import { jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import { generateId } from '@billing/base';
import type {
  AuthResponse,
  WorkOsUser,
} from '@billing/backend-common/services/Auth/auth.types';
import { env } from '@billing/backend-common/env';
import {
  AccountEntity,
  accountsTable,
} from '@billing/database/schemas/accounts.db';

// Get secret
const secret = new Uint8Array(Buffer.from(env.JWT_SECRET_KEY, 'base64'));

export const AuthService = {
  validateAuth: async (authToken: string): Promise<WorkOsUser> => {
    const verifiedToken = await jwtVerify(authToken, secret);
    return verifiedToken.payload.user as WorkOsUser;
  },
  createOrGetUser: async (workOsUser: WorkOsUser): Promise<AuthResponse> => {
    const userData = await db.query.usersTable.findFirst({
      where: eq(usersTable.workOsId, workOsUser.id),
      with: {
        account: true,
      },
    });

    if (userData) {
      return {
        user: userData,
        account: userData.account,
      };
    }

    return AuthService.createNewUser(workOsUser);
  },
  createNewUser: async (
    workOsUser: WorkOsUser
  ): Promise<{
    user: UserEntity;
    account: AccountEntity;
  }> => {
    // create new account and user
    const newAccount: AccountEntity = {
      id: generateId('account'),
      createdAt: new Date().toISOString(),
      hasBucket: 0,
    };

    const newUser: UserEntity = {
      id: generateId('user'),
      createdAt: new Date().toISOString(),
      workOsId: workOsUser.id,
      accountId: newAccount.id,
      email: workOsUser.email,
      firstName: workOsUser.firstName,
      lastName: workOsUser.lastName,
    };

    // insert into db
    await db.transaction(async (_) => {
      await db.insert(accountsTable).values(newAccount);
      await db.insert(usersTable).values(newUser);
    });

    // console.log({ results });

    return {
      user: newUser,
      account: newAccount,
    };
  },
};
