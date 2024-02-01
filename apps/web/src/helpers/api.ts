import { appContract } from '@billing/api-routes';
import { initQueryClient } from '@ts-rest/react-query';
import { env } from '../env.mjs';

export const useApiClient = () => {
  return initQueryClient(appContract, {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    baseHeaders: {},
  });
};
