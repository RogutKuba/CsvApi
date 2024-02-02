import {
  AuthResponse,
  WorkOsUser,
} from '@billing/backend-common/services/Auth/auth.types';

export type HonoEnv = {
  Variables: {
    workOsUser: WorkOsUser;
    user: AuthResponse['user'] & {
      account: AuthResponse['account'];
    };
  };
};
