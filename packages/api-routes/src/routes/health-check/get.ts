import { z } from "zod";
import type {
  BaseRoute} from "@starter/api-routes/routes/base";
import {
  EmptyHeaders,
  EmptyZod,
} from "@starter/api-routes/routes/base";

const params = EmptyZod;

const query = EmptyZod;

const body = EmptyZod;

const response = z.object({
  health: z.literal("ok"),
});

const headers = EmptyHeaders;

export const HealthCheckGetRouteType: BaseRoute<
  typeof params,
  typeof body,
  typeof query,
  typeof response,
  typeof headers
> = {
  method: "get" as const,
  path: "/health-check",
  validate: {
    params,
    body,
    query,
    response,
    headers,
  },
  authentication: undefined,
};
