import { z } from "zod";
import {
  type BaseRoute,
  EmptyHeaders,
  EmptyZod,
} from "@starter/api-routes/routes/base";

const params = EmptyZod;

const query = EmptyZod;

const body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const response = z.object({
  url: z.string().url(),
});

const headers = EmptyHeaders;

export const AuthPostRouteType: BaseRoute<
  typeof params,
  typeof body,
  typeof query,
  typeof response,
  typeof headers
> = {
  method: "post" as const,
  path: "/auth",
  validate: {
    params,
    body,
    query,
    response,
    headers,
  },
  authentication: undefined,
};
