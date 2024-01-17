import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default {
  schema: "./src/schemas/**/*.ts",
  out: "./src/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
