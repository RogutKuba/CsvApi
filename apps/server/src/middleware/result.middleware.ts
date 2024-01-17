import type Koa from "koa";

/**
 * Add a Content-Type header to every response
 */
export const useResultMiddleware: () => Koa.Middleware = () => {
  const middleware: Koa.Middleware = async (ctx, next) => {
    ctx.headers["Content-Type"] = "application/json";
    await next();
  };

  return middleware;
};
