/* eslint-disable no-console -- this is a cli file */
import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './db';

config({ path: '.env.local' });

function main() {
  migrate(db, { migrationsFolder: './src/migrations' })
    .then(() => {
      console.log('Migration completed!');
    })
    .catch((error) => {
      console.error(`Migration failed! ${error}`);
    });
}

main();
