import type { z } from "zod";
import { HealthCheckGetRouteType } from "@starter/api-routes/routes/health-check/get";
import { genericFetch } from "@starter/api-tools/fetcher";

function get(data: {
  params: z.infer<typeof HealthCheckGetRouteType.validate.params>;
  query: z.infer<typeof HealthCheckGetRouteType.validate.query>;
  body: z.infer<typeof HealthCheckGetRouteType.validate.body>;
}) {
  return genericFetch<
    z.infer<typeof HealthCheckGetRouteType.validate.params>,
    z.infer<typeof HealthCheckGetRouteType.validate.query>,
    z.infer<typeof HealthCheckGetRouteType.validate.body>,
    z.infer<typeof HealthCheckGetRouteType.validate.response>
  >({
    method: "get",
    path: "/health-check",
    params: data.params,
    query: data.query,
    body: data.body,
    responseSchema: HealthCheckGetRouteType.validate.response,
  });
}
export default get;
