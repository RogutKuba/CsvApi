// router.ts
import { RecursiveRouterObj, initServer } from 'ts-rest-hono';
import { appContract } from '@billing/api-routes';
import { HonoEnv } from './context';
import { Id, generateId } from '@billing/base';
import { ApiEntity, apisTable } from '@billing/database/schemas/api.db';
import { createApiService } from '@billing/backend-common/services/Api/Api.service';
import { getUserSafe } from './utils/getUserSafe';
import { db } from '@billing/database/db';
import { eq } from 'drizzle-orm';
import { userArgs } from './handlers/userHandler';
import { HTTPException } from 'hono/http-exception';
import { ServerError } from '@billing/backend-common/errors/serverError';

const s = initServer<HonoEnv>();

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
    getApis: async (_, ctx) => {
      const user = getUserSafe(ctx);

      const apis = await db.query.apisTable.findMany({
        where: eq(apisTable.accountId, user.accountId),
      });

      return {
        status: 200,
        body: apis,
      };
    },
    // create,
    createApi: async ({ body }, ctx) => {
      const apiService = createApiService();

      const fileToUpload = body.file;

      const user = getUserSafe(ctx);

      const api = await apiService.createApi({
        account: user.account,
        fileToUpload,
        fieldDelimeter: ', ',
        db,
      });

      return {
        status: 200,
        body: api,
      };
    },
    updateApi: async () => {
      const newApi: ApiEntity = {
        id: generateId('api'),
        createdAt: new Date().toISOString(),
        accountId: 'acc_123',
        fileName: 'ada',
        fileKey: 'file_123',
        isActive: 1,
        schema: [],
        fieldDelimeter: ', ',
      };

      return {
        status: 200,
        body: newApi,
      };
    },
    updateApiData: async ({ body }, ctx) => {
      const apiService = createApiService();

      const fileToUpload = body.file;

      const user = getUserSafe(ctx);

      const api = await db.transaction(async (tx) => {
        return await apiService.createApi({
          account: user.account,
          fileToUpload,
          fieldDelimeter: ', ',
          db: tx,
        });
      });

      return {
        status: 200,
        body: api,
      };
    },
    deleteApi: async () => {
      throw new ServerError({ message: '123' });

      return {
        status: 200,
        body: 'removed',
      };
    },
    queryApi: async ({ params, query }) => {
      const apiService = createApiService();

      const data = await apiService.queryData({
        apiId: params.id as Id<'api'>,
        queryFilters: query.where ? [query.where] : [],
        db,
      });

      return {
        status: 200,
        body: data,
      };
    },
  },
  user: userArgs,
};

export const handlers = s.router(appContract, args);
