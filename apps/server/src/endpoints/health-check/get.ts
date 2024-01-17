import { HealthCheckGetRouteType } from "@starter/api-routes/routes/rollup";
import { specFactory } from "@server/specFactory";

export const HealthCheckGetRoute = specFactory.createRouteSpec({
  ...HealthCheckGetRouteType,
  handler: async (ctx, next) => {
    ctx.body = {
      health: "ok",
    };

    await next();
  },
});
