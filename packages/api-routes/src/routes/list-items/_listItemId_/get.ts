import { ListItemZod } from "@starter/database/schemas/rollup";
import { z } from "zod";
import type {
  BaseRoute} from "@starter/api-routes/routes/base";
import {
  EmptyHeaders,
  EmptyZod,
} from "@starter/api-routes/routes/base";

const params = z.object({
  listItemId: z.string(),
});

const query = EmptyZod;

const body = EmptyZod;

const response = ListItemZod;

const headers = EmptyHeaders;

export const ListItemsGetRouteType: BaseRoute<
  typeof params,
  typeof body,
  typeof query,
  typeof response,
  typeof headers
> = {
  method: "get" as const,
  path: "/list-items/:listItemId",
  validate: {
    params,
    body,
    query,
    response,
    headers,
  },
  authentication: "user",
};
