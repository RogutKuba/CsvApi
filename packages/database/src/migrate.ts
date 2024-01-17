/* eslint-disable no-console -- this is a cli file */

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { migrate } from "drizzle-orm/planetscale-serverless/migrator";
import { connect } from "@planetscale/database";
import { config } from "dotenv";

config({ path: ".env.local" });

console.log(process.env.DB_HOST);

if (!process.env.DB_HOST) {
  throw new Error("Missing DB_HOST env variable");
}

if (!process.env.DB_USERNAME) {
  throw new Error("Missing DB_USERNAME env variable");
}

if (!process.env.DB_PASSWORD) {
  throw new Error("Missing DB_PASSWORD env variable");
}

const connection = connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
const db = drizzle(connection);

const main = async () => {
  console.log("Starting migration...");

  await migrate(db, { migrationsFolder: "./src/migrations" }).catch((error) => {
    console.error(error);
  });
  console.log("Migration completed!");
};

main().catch((error) => {
  console.error(error);
});
