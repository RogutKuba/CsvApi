import type { WorkOsUser } from '@billing/backend-common/services/Auth/auth.types';
import type { UserEntity } from '@billing/database/schemas/rollup';

export interface ServerContext {
  workOsuser: WorkOsUser;
  user: UserEntity;
}
