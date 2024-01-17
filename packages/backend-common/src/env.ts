import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    JWT_SECRET_KEY: z.string().min(1),
    WORKOS_API_KEY: z.string().min(1),
    WORKOS_CLIENT_ID: z.string().min(1),
  },
  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
