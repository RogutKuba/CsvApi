import { db } from "@starter/database/db";
import type { UserEntity } from "@starter/database/schemas/users.db";
import { users } from "@starter/database/schemas/users.db";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { generateId } from "@starter/base";
import type { WorkOsUser } from "@starter/backend-common/services/Auth/auth.types";
import { env } from "@starter/backend-common/env";

// Get secret
const secret = new Uint8Array(Buffer.from(env.JWT_SECRET_KEY, "base64"));

export const AuthService = {
  validateAuth: async (authToken: string): Promise<WorkOsUser> => {
    const verifiedToken = await jwtVerify(authToken, secret);
    return verifiedToken.payload.user as WorkOsUser;
  },
  createOrGetUser: async (workOsUser: WorkOsUser): Promise<UserEntity> => {
    const user = await db.query.users.findFirst({
      where: eq(users.workOsId, workOsUser.id),
    });

    if (user) {
      return user;
    }

    const newUser: UserEntity = {
      id: generateId("user"),
      workOsId: workOsUser.id,
      email: workOsUser.email,
      firstName: workOsUser.firstName,
      lastName: workOsUser.lastName,
      createdAt: new Date(),
      maxListItems: 10,
    };

    await db.insert(users).values(newUser);
    return newUser;
  },
};
