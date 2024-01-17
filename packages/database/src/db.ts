import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schemas from "./schemas/rollup";

const connection = connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export const db = drizzle(connection, {
  schema: schemas,
});
