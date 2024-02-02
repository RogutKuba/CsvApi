import { ResultSet, createClient } from '@libsql/client';
import { config } from 'dotenv';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import * as schemas from './schemas/rollup';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.DATABASE_URL ?? '',
  authToken: process.env.DATABASE_AUTH_TOKEN ?? '',
});

export const db = drizzle(client, {
  schema: schemas,
  // logger: true,
});

export type DbClient =
  | LibSQLDatabase<typeof schemas>
  | SQLiteTransaction<
      'async',
      ResultSet,
      typeof schemas,
      ExtractTablesWithRelations<typeof schemas>
    >;
