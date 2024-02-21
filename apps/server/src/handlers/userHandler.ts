// router.ts
import { RecursiveRouterObj } from 'ts-rest-hono';
import { appContract } from '@billing/api-routes';
import { HonoEnv } from '../context';
import { getUserSafe } from '../utils/getUserSafe';

export const userArgs: RecursiveRouterObj<
  (typeof appContract)['user'],
  HonoEnv
> = {
  getUser: async (_, ctx) => {
    const userData = getUserSafe(ctx);

    return {
      status: 200,
      body: {
        user: userData,
        account: userData.account,
        subscriptionPlan: userData?.account?.subscriptionPlan,
      },
    };
  },
};
