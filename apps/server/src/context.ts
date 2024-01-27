import { WorkOsUser } from '@billing/backend-common/services/Auth/auth.types';
import { AccountEntity } from '@billing/database/src/schemas/accounts.db';
import { UserEntity } from '@billing/database/src/schemas/users.db';

export type HonoEnv = {
  Variables: {
    workOsUser: WorkOsUser;
    user: UserEntity & {
      account: AccountEntity;
    };
  };
};
