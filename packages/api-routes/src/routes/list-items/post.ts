import { z } from "zod";
import type {
  BaseRoute} from "@starter/api-routes/routes/base";
import {
  EmptyHeaders,
  EmptyZod,
} from "@starter/api-routes/routes/base";

const params = EmptyZod;

const query = EmptyZod;

const body = z.object({
  title: z.string(),
  description: z.string(),
});

const response = z.object({});

const headers = EmptyHeaders;

export const ListItemsPostRouteType: BaseRoute<
  typeof params,
  typeof body,
  typeof query,
  typeof response,
  typeof headers
> = {
  method: "post" as const,
  path: "/list-items",
  validate: {
    params,
    body,
    query,
    response,
    headers,
  },
  authentication: "user",
};
