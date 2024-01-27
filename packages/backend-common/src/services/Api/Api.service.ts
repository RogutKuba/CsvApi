import { S3 as AwsS3Client } from '@aws-sdk/client-s3';
import { env } from '@billing/backend-common/env';
import { ServerError } from '@billing/backend-common/errors/serverError';
import { Id, generateId } from '@billing/base';
import { db } from '@billing/database/db';
import { AccountEntity } from '@billing/database/schemas/accounts.db';
import { ApiEntity, apisTable } from '@billing/database/schemas/api.db';
import { logger } from '@billing/logger';
import { and, eq } from 'drizzle-orm';
import { getBucketName } from './helpers/getBucketName';

export const createApiService = () => {
  const s3Client = new AwsS3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const self = {
    createApi: async (params: {
      account: AccountEntity;
      fileToUpload: File | Blob;
    }) => {
      const { account, fileToUpload } = params;

      logger.info({
        accountId: account.id,
        data: fileToUpload,
        type: 'create',
      });

      // upload file to s3, create file
      if (account.hasBucket == 0) {
        await s3Client.createBucket({
          Bucket: getBucketName(account.id),
        });
      }

      // check if bucket exists for account
      const fileKey = generateId('file');

      await s3Client.putObject({
        Bucket: getBucketName(account.id),
        Key: fileKey,
        Body: fileToUpload,
      });

      // api->file relshp
      const newApi: ApiEntity = {
        id: generateId('api'),
        createdAt: new Date().toISOString(),
        accountId: account.id,
        fileKey,
        isActive: 1,
      };

      await db.insert(apisTable).values(newApi);
    },
    updateApiData: async (params: {
      account: AccountEntity;
      apiId: Id<'api'>;
      newCsvData: string;
    }) => {
      const { apiId, newCsvData } = params;

      logger.info({
        apiId,
        data: newCsvData.length,
        type: 'update',
      });

      const api = await db.query.apisTable.findFirst({
        where: and(eq(apisTable.id, apiId), eq(apisTable.isActive, 1)),
      });

      if (!api) {
        throw new ServerError({
          message: 'No api found!',
        });
      }

      // remove file from csv bucket and update api->file relshp
      await s3Client.deleteObject({
        Bucket: getBucketName(api.accountId),
        Key: api.fileKey,
      });

      // upload new file
      const fileKey = generateId('file');

      await s3Client.putObject({
        Bucket: getBucketName(api.accountId),
        Key: fileKey,
        Body: Buffer.from(newCsvData),
      });

      // update api entity to new file key
      await db
        .update(apisTable)
        .set({
          fileKey,
        })
        .where(eq(apisTable.id, api.id));
    },
    deleteApi: async (params: { apiId: Id<'api'> }) => {
      // delete file and archive api
      const { apiId } = params;

      logger.info({
        apiId,
        type: 'delete',
      });

      const api = await db.query.apisTable.findFirst({
        where: and(eq(apisTable.id, apiId), eq(apisTable.isActive, 1)),
      });

      if (!api) {
        throw new ServerError({
          message: 'No api found!',
        });
      }

      await s3Client.deleteObject({
        Bucket: getBucketName(api.accountId),
        Key: api.fileKey,
      });

      // update api entity to inactive
      await db
        .update(apisTable)
        .set({
          isActive: 0,
        })
        .where(eq(apisTable.id, api.id));
    },
    fetchData: async (params: {
      accountId: Id<'account'>;
      apiId: Id<'api'>;
      queryFilters: String[];
    }) => {
      const { apiId, queryFilters } = params;

      const api = await db.query.apisTable.findFirst({
        where: and(eq(apisTable.id, apiId), eq(apisTable.isActive, 1)),
      });

      if (!api) {
        throw new ServerError({
          message: 'No api found!',
        });
      }

      // construct sql query
      const sqlExpression = `SELECT * FROM S3Object WHERE ${queryFilters.join(
        ' AND '
      )}`;

      logger.info({
        apiId,
        accountId: api.accountId,
        sql: sqlExpression,
        type: 'query',
      });

      const result = await s3Client.selectObjectContent({
        Bucket: getBucketName(api.accountId),
        Key: api.fileKey,
        Expression: sqlExpression,
        ExpressionType: 'SQL',
        InputSerialization: {
          CSV: {},
        },
        OutputSerialization: {
          CSV: {},
        },
      });

      logger.log('payload', result.Payload);

      return result.Payload;
    },
  };

  return self;
};
