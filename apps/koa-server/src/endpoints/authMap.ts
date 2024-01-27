import { routes } from '@billing/api-routes/routes';

export const getEndpoinAuthMap = (): Map<string | RegExp, boolean> => {
  const authMap = new Map<string | RegExp, boolean>();

  for (const route of Object.values(routes)) {
    if (route.authentication) {
      authMap.set(route.path, true);
    }
  }

  return authMap;
};
