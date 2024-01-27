import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import * as schemas from './schemas/rollup';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.DATABASE_URL ?? '',
  authToken: process.env.DATABASE_AUTH_TOKEN ?? '',
});

export const db = drizzle(client, {
  schema: schemas,
  // logger: true,
});
