import { logger } from "@starter/logger";
import Koa from "koa";
import KoaCors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import zodRouter from "koa-zod-router";
import { useLoggerMiddleware } from "@server/middleware/logger.middleware";
import { useErrorMiddleware } from "@server/middleware/error.middleware";
import { useResultMiddleware } from "@server/middleware/result.middleware";
import { getEndpoinAuthMap } from "@server/endpoints/authMap";
import { authMiddleware } from "@server/middleware/auth.middleware";
import type { ServerContext } from "@server/context/rollup";
import * as endpoints from "@server/endpoints/rollup";

export const createServer = (): Koa => {
  const app = new Koa();

  const port = 8000;

  app.listen(Number(port), undefined, () => {
    logger.info(`Listening on port ${port}`);
  });

  // middleware
  app.use(useLoggerMiddleware());
  app.use(useErrorMiddleware());
  app.use(bodyParser());
  app.use(
    KoaCors({
      credentials: true,
    })
  );

  // get routes
  const authRouter = zodRouter<ServerContext>({
    zodRouter: {
      exposeRequestErrors: true,
      exposeResponseErrors: true,
    },
  });
  const publicRouter = zodRouter<ServerContext>({
    zodRouter: {
      exposeRequestErrors: true,
      exposeResponseErrors: true,
    },
  });

  // add auth middleware
  authRouter.use(authMiddleware);

  // register all routes
  const authMap = getEndpoinAuthMap();
  for (const endpoint of Object.values(endpoints)) {
    if (authMap.get(endpoint.path) === true) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- used for generic
      authRouter.register(endpoint as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- used for generic
      publicRouter.register(endpoint as any);
    }
  }

  app.use(publicRouter.routes());
  app.use(authRouter.routes());

  // result middleware
  app.use(useResultMiddleware());

  return app;
};
