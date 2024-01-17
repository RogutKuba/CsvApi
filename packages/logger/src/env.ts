import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    AXIOM_DATASET: z.string(),
    AXIOM_TOKEN: z.string(),
    AXIOM_ORG_ID: z.string(),
  },
  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
