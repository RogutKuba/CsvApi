import { AccountEntity } from '@billing/database/schemas/accounts.db';
import { SubscriptionPlanEntity } from '@billing/database/schemas/subscriptionPlan.db';
import { UserEntity } from '@billing/database/schemas/users.db';

export interface WorkOsUser {
  object: 'user';
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  account: AccountEntity & {
    subscriptionPlan: SubscriptionPlanEntity;
  };
  user: UserEntity;
}
