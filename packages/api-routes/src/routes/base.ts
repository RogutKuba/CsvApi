import { z } from "zod";

export interface BaseRoute<P, B, Q, R, H> {
  method: "get" | "post" | "patch" | "put" | "delete";
  path: string;
  validate: {
    params: P;
    body: B;
    query: Q;
    response: R;
    headers: H;
  };
  authentication: "user" | "admin" | undefined;
}

export const EmptyZod = z.object({}).or(z.undefined());

export const EmptyHeaders = z.object({});

export const AuthHeaders = EmptyHeaders.extend({
  "x-authorization-token": z.string().min(1),
});
