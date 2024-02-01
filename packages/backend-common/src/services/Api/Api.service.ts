import { S3 as AwsS3Client } from '@aws-sdk/client-s3';
import { env } from '@billing/backend-common/env';
import { ServerError } from '@billing/backend-common/errors/serverError';
import { Id, generateId } from '@billing/base';
import { db } from '@billing/database';
import { logger } from '@billing/logger';
import { and, eq } from 'drizzle-orm';
import { getBucketName, getItemKey } from './helpers/getBucketName';
import { AccountEntity } from '@billing/database/schemas/accounts.db';
import { ApiEntity, apisTable } from '@billing/database/schemas/api.db';
import { getDataSchema } from './helpers/getDataSchema';

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
      fileToUpload: Blob;
      fieldDelimeter: string;
    }): Promise<ApiEntity> => {
      const { account, fileToUpload, fieldDelimeter } = params;

      logger.info({
        accountId: account.id,
        data: fileToUpload.length,
        type: 'create',
      });

      const fileKey = generateId('file');

      // TODO: parse csv and add row_idx in each row
      // also store raw file on its own for download by user

      const newApi = await db.transaction(async (_) => {
        await s3Client.putObject({
          Bucket: getBucketName(),
          Key: getItemKey([account.id, fileKey]),
          Body: Buffer.from(await fileToUpload.arrayBuffer()),
        });

        // fetch first two lines
        const [headerRow, firstDataRow] = await self.queryLinesForSchema({
          accountId: account.id,
          fileKey,
        });

        // api->file relshp
        const newApi: ApiEntity = {
          id: generateId('api'),
          createdAt: new Date().toISOString(),
          accountId: account.id,
          fileName: fileToUpload.name,
          fileKey,
          isActive: 1,
          fieldDelimeter,
          schema: await getDataSchema({
            headerRow,
            firstRow: firstDataRow,
            fieldDelimeter,
          }),
        };

        await db.insert(apisTable).values(newApi);

        return newApi;
      });

      return newApi;
    },
    updateApiData: async (params: {
      account: AccountEntity;
      apiId: Id<'api'>;
      fileToUpload: Blob;
    }): Promise<ApiEntity> => {
      const { apiId, fileToUpload } = params;

      logger.info({
        apiId,
        data: fileToUpload.length,
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

      // upload new file
      const fileKey = generateId('file');

      await db.transaction(async () => {
        // remove file from csv bucket and update api->file relshp
        await s3Client.deleteObject({
          Bucket: getBucketName(),
          Key: getItemKey([api.accountId, api.fileKey]),
        });

        await s3Client.putObject({
          Bucket: getBucketName(),
          Key: getItemKey([api.accountId, fileKey]),
          Body: Buffer.from(await fileToUpload.arrayBuffer()),
        });

        // update api entity to new file key
        await db
          .update(apisTable)
          .set({
            fileKey,
            fileName: fileToUpload.name,
          })
          .where(eq(apisTable.id, api.id));
      });

      return {
        ...api,
        fileKey,
      };
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

      await db.transaction(async () => {
        await s3Client.deleteObject({
          Bucket: getBucketName(),
          Key: getItemKey([api.accountId, api.fileKey]),
        });

        // update api entity to inactive
        await db
          .update(apisTable)
          .set({
            isActive: 0,
          })
          .where(eq(apisTable.id, api.id));
      });
    },
    queryData: async (params: { apiId: Id<'api'>; queryFilters: String[] }) => {
      const { apiId, queryFilters } = params;

      const api = await db.query.apisTable.findFirst({
        where: and(eq(apisTable.id, apiId), eq(apisTable.isActive, 1)),
      });

      if (!api) {
        throw new ServerError({
          message: 'No api found!',
        });
      }

      // construct select statements with casting based on
      const selectStatement = api.schema.reduce((prev, { field, type }) => {
        console.log(field, type);

        return `${prev}${
          prev.length > 0 ? ',' : ''
        } CAST(s."${field}" as ${type}) as "${field}"`;
      }, '');

      // construct where filters
      const whereFilter =
        queryFilters.length > 0 ? `WHERE ${queryFilters.join(' AND ')}` : '';

      // construct final sql query
      const sqlExpression = `SELECT ${selectStatement} FROM S3Object s ${whereFilter}`;

      logger.info({
        apiId,
        accountId: api.accountId,
        sql: sqlExpression,
        type: 'query',
      });

      const rawResult = await s3Client.selectObjectContent({
        Bucket: getBucketName(),
        Key: getItemKey([api.accountId, api.fileKey]),
        Expression: sqlExpression,
        ExpressionType: 'SQL',
        InputSerialization: {
          CSV: {
            FileHeaderInfo: 'USE',
            FieldDelimiter: ',',
          },
          CompressionType: 'NONE',
        },
        OutputSerialization: {
          JSON: {
            RecordDelimiter: ',',
          },
        },
      });

      const events = rawResult.Payload!;
      const csvData = [];

      for await (const event of events) {
        if (event.Records?.Payload) {
          csvData.push(event.Records.Payload);
        }
      }

      const result =
        '[' + Buffer.concat(csvData).toString('utf-8').slice(0, -1) + ']';

      try {
        return JSON.parse(result);
      } catch (e) {
        return result;
      }
    },
    queryLinesForSchema: async (params: {
      accountId: Id<'account'>;
      fileKey: Id<'file'>;
    }) => {
      const { accountId, fileKey } = params;

      const rawResult = await s3Client.selectObjectContent({
        Bucket: getBucketName(),
        Key: getItemKey([accountId, fileKey]),
        Expression: 'SELECT * FROM s3object s LIMIT 2;', // sqlExpression,
        ExpressionType: 'SQL',
        InputSerialization: {
          CSV: {
            FileHeaderInfo: 'NONE',
          },
          CompressionType: 'NONE',
        },
        OutputSerialization: {
          CSV: {},
        },
      });

      const events = rawResult.Payload!;
      const csvData = [];

      for await (const event of events) {
        if (event.Records?.Payload) {
          csvData.push(event.Records.Payload);
        }
      }

      const result = Buffer.concat(csvData).toString('utf-8');

      return result.split('\n');
    },
  };

  return self;
};
