// router.ts
import { RecursiveRouterObj, initServer } from 'ts-rest-hono';
import { appContract } from '@billing/api-routes';
import { ApiEntity, ApiModel } from '@billing/database/src/schemas/rollup';
import { createApiService } from '@billing/backend-common/services/Api/Api.service';
import { HonoEnv } from './context';

const s = initServer<HonoEnv>();

const test: ApiEntity = {
  id: '123',
  createdAt: new Date().toISOString(),
  accountId: '123',
  fileKey: '123',
  isActive: 0,
};

const args: RecursiveRouterObj<typeof appContract, HonoEnv> = {
  health: async () => {
    return {
      status: 200,
      body: {
        status: 'ok',
      },
    };
  },
  api: {
    // create,
    createApi: async ({ body }, ctx) => {
      const apiService = createApiService();

      const fileToUpload = body.file;

      const user = ctx.get('user');

      await apiService.createApi({
        account: user.account,
        fileToUpload,
      });

      return {
        status: 200,
        body: test,
      };
    },
    updateApi: async () => {
      return {
        status: 200,
        body: test,
      };
    },
    updateApiData: async () => {
      return {
        status: 200,
        body: test,
      };
    },
    deleteApi: async () => {
      return {
        status: 200,
        body: 'removed',
      };
    },
    queryApi: async () => {
      return {
        status: 200,
        body: 'funny fake data',
      };
    },
  },
};

export const handlers = s.router(appContract, args);
