import { S3 as AwsS3Client } from '@aws-sdk/client-s3';
import { env } from '@billing/backend-common/env';
import { ServerError } from '@billing/backend-common/errors/serverError';
import { Id, generateId } from '@billing/base';
import { logger } from '@billing/logger';
import { and, eq } from 'drizzle-orm';
import { getBucketName, getItemKey } from './helpers/getBucketName';
import {
  AccountEntity,
  accountsTable,
} from '@billing/database/schemas/accounts.db';
import { ApiEntity, apisTable } from '@billing/database/schemas/api.db';
import { getDataSchema, getFieldType } from './helpers/getDataSchema';
import { requestLogsTable } from '@billing/database/schemas/requestLog.db';
import { LimitService } from '../Limit/Limit.service';
import { AuthResponse } from '../Auth/auth.types';
import { DbClient } from '@billing/database/db';

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
      account: AuthResponse['account'];
      fileName: string;
      fileToUpload: Blob;
      fieldDelimeterSpace: number;
      db: DbClient;
    }): Promise<ApiEntity> => {
      const { account, fileName, fileToUpload, fieldDelimeterSpace, db } =
        params;

      logger.info({
        accountId: account.id,
        data: fileToUpload.length,
        type: 'create',
      });

      const fileKey = generateId('file');

      await LimitService.assertNumberApis({
        account,
      });

      await s3Client.putObject({
        Bucket: getBucketName(),
        Key: getItemKey([account.id, fileKey]),
        Body: Buffer.from(await fileToUpload.arrayBuffer()),
      });

      // fetch first two lines
      const [headerRow, firstDataRow] = await self.queryLinesForSchema({
        accountId: account.id,
        fileKey,
        db,
      });

      // api->file relshp
      const newApi: ApiEntity = {
        id: generateId('api'),
        createdAt: new Date().toISOString(),
        accountId: account.id,
        fileName,
        fileKey,
        isActive: 1,
        fieldDelimeterSpace,
        schema: await getDataSchema({
          headerRow,
          firstRow: firstDataRow,
          fieldDelimeterSpace,
        }),
      };

      await db.transaction(async (tx) => {
        await LimitService.updateApiCount({
          accountId: account.id,
          num: 1,
          db: tx,
        });
        await tx.insert(apisTable).values(newApi);
      });

      return newApi;
    },
    updateApiData: async (params: {
      account: AccountEntity;
      apiId: Id<'api'>;
      fileToUpload: Blob;
      db: DbClient;
    }): Promise<ApiEntity> => {
      const { apiId, fileToUpload, db } = params;

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

      await db.transaction(async (tx) => {
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
        await tx
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
    deleteApi: async (params: { apiId: Id<'api'>; db: DbClient }) => {
      // delete file and archive api
      const { apiId, db } = params;

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
        await LimitService.updateApiCount({
          accountId: api.accountId,
          num: -1,
          db,
        });

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
    queryData: async (params: {
      apiId: Id<'api'>;
      queryFilters: String[];
      db: DbClient;
    }) => {
      const { apiId, queryFilters, db } = params;

      const api = await db.query.apisTable.findFirst({
        where: and(eq(apisTable.id, apiId), eq(apisTable.isActive, 1)),
        with: {
          account: {
            with: {
              subscriptionPlan: true,
            },
          },
        },
      });

      if (!api || !api.account) {
        throw new ServerError({
          message: 'No api found!',
        });
      }

      // assert request limit
      await LimitService.assertRequests({
        account: api.account,
        db,
      });

      // construct select statements with casting based on
      const selectStatement = api.schema.reduce((prev, { field, type }) => {
        return `${prev}${
          prev.length > 0 ? ',' : ''
        } CAST(s."${field}" as ${type}) as "${field}"`;
      }, '');

      // construct where filters
      const whereFilter = (() => {
        // split filters into field, operator, value with regex
        const regex = /(\w+)(>|>=|<|<=|=)(\w+)/;

        return queryFilters.map((rawFilter) => {
          const matches = rawFilter.match(regex);

          if (!matches) {
            return '';
          } else {
            const [_, field, operator, value] = matches;

            const dataType = getFieldType(value);

            return `WHERE CAST(s."${field}" as ${dataType}) ${operator} ${
              dataType !== 'string' ? value : `'${value}'`
            }`;
          }
        });
      })();

      // construct final sql query
      const sqlExpression = `SELECT ${selectStatement} FROM S3Object s ${whereFilter}`;

      logger.info({
        apiId,
        accountId: api.accountId,
        sql: sqlExpression,
        type: 'query',
      });

      try {
        await db.insert(requestLogsTable).values({
          id: generateId('requestLog'),
          createdAt: new Date().toISOString(),
          apiId,
          accountId: api.accountId,
          rawQuery: sqlExpression,
        });
      } catch (e) {
        logger.error('error saving requestLog!' + e);
      }

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
      db: DbClient;
    }) => {
      const { accountId, fileKey, db } = params;

      const rawResult = await s3Client.selectObjectContent({
        Bucket: getBucketName(),
        Key: getItemKey([accountId, fileKey]),
        Expression: 'SELECT * FROM s3object s LIMIT 2;',
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
