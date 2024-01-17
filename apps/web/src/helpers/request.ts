import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const wrapRequestWithCookies = (
  func: (...args: any) => any,
  params: any,
  cookiesList: ReadonlyRequestCookies
) => {
  const cookiesFormattedString = cookiesList
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return func({
    ...params,
    headers: {
      cookie: cookiesFormattedString,
      ...params.headers,
    },
  });
};
