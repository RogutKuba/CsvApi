'use client';
import { appContract, authContract } from '@billing/api-routes';
import { initQueryClient } from '@ts-rest/react-query';
import { env } from '../env.mjs';
import Cookies from 'js-cookie';

export const useApiClient = () => {
  const authToken = Cookies.get('x-auth-token');

  console.log({ authToken });

  return initQueryClient(appContract, {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    baseHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const useAuthClient = () => {
  return initQueryClient(authContract, {
    baseUrl: 'http://localhost:3000/api',
    baseHeaders: {},
  });
};
