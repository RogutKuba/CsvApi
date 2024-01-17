import type { WorkOsUser } from "@starter/backend-common/services/Auth/auth.types";
import type { UserEntity } from "@starter/database/schemas/rollup";

export interface ServerContext {
  workOsuser: WorkOsUser;
  user: UserEntity;
}
