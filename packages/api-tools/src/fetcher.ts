import type { z } from "zod";
import type {
  ErrorResponse,
  OkResponse,
  RedirectResponse,
} from "@starter/api-tools/responses";

const formatCookies = (cookies: { name: string; value: string }[]) => {
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
};

export const genericFetch = async <Params, Query, Body, ResponseType>(data: {
  method: "get" | "post" | "patch" | "delete";
  path: string;
  params: Params;
  query: Query;
  body: Body;
  cookies?: {
    name: string;
    value: string;
  }[];
  responseSchema: z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
}): Promise<OkResponse<ResponseType> | ErrorResponse | RedirectResponse> => {
  try {
    const { method, path, query, body, cookies } = data;

    const url = (() => {
      const base =
        process.env.NEXT_PUBLIC_API_URL ??
        process.env.API_URL ??
        "http://localhost:5001";
      if (!base) {
        throw new Error("API_URL not set");
      }

      // transform path with params
      const formattedPath = (() => {
        const parts = path.split("/");
        const formattedParts = parts.map((part) => {
          if (part.startsWith(":")) {
            const key = part.slice(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- used for generic
            const value = (data.params as any)[key];
            if (!value) {
              throw new Error(`Missing param ${key}`);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- used for generic
            return value;
          }
          return part;
        });
        return formattedParts.join("/");
      })();

      return `${base + formattedPath}?${new URLSearchParams(
        query as Record<string, string>
      ).toString()}`;
    })();

    const response = await fetch(url, {
      method: method.toUpperCase(),
      body: method !== "get" && body ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(cookies ? { cookie: formatCookies(cookies) } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      // TODO: handle error better
      if (response.status === 302) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- used for generic
        const resBody = await response.json();
        return {
          ok: false,
          status: 302,
          redirect: resBody.redirect, // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- used for generic
        };
      }

      const err = (await response.json()) as ErrorResponse;
      return {
        ok: false,
        status: response.status,
        title: err.title ?? "Unkown error occurred", // eslint-disable-line @typescript-eslint/no-unnecessary-condition -- fallback in case of error
        message: err.message,
      };
    }
    // validate response with zod
    const resData = await response.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- used for generic
    const parsedData = resData as ResponseType;

    return {
      ok: true,
      status: response.status,
      data: parsedData,
    };
  } catch (e) {
    const fallbackError: ErrorResponse = {
      ok: false,
      status: 500,
      title: "Error!",
      message: "Something went wrong!",
    };
    return fallbackError;
  }
};
