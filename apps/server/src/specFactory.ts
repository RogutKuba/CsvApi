import { routerSpecFactory } from "koa-zod-router";
import type { ServerContext } from "@server/context/rollup";

export const specFactory = routerSpecFactory<ServerContext>();
