'use client';
import { appContract, authContract } from '@billing/api-routes';
import { initQueryClient } from '@ts-rest/react-query';
import { tsRestFetchApi } from '@ts-rest/core';
import { env } from '../env.mjs';
import Cookies from 'js-cookie';
import { useToast } from '@billing/ui/src/components/use-toast';
import { useRouter } from 'next/navigation';

export const useApiClient = () => {
  const { toast } = useToast();
  const router = useRouter();

  return initQueryClient(appContract, {
    api: async (args) => {
      const authToken = Cookies.get('x-auth-token');

      // try {
      // want to handle errors with toasts, as well as auto-handle redirects to login for unauthorized requests
      const result = await tsRestFetchApi({
        ...args,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (result.status === 401) {
        const redirectPath = (result.body as any)?.redirect ?? '/app/login';
        router.push(redirectPath);
      }

      if (result.status !== 200) {
        const title = (result.body as any)?.title;
        const message = (result.body as any)?.message;
        const errorTitle = title?.length > 0 ? title : 'Something went wrong!';
        const errorMessage =
          message?.length > 0
            ? message
            : 'An error occurred. Please try again.';
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: 'destructive',
        });
      }

      // if (result.status === 200) {
      //   // toast if successful
      //   const title = (result.body as any)?.title;
      //   const message = (result.body as any)?.message;

      //   if (title?.length > 0 && message?.length > 0) {
      //     toast({
      //       title,
      //       description: message,
      //     });
      //   }
      // }

      return result;
    },
    baseUrl: env.NEXT_PUBLIC_API_URL,
    baseHeaders: {},
  });
};

export const useAuthClient = () => {
  return initQueryClient(authContract, {
    baseUrl: 'http://localhost:3000/api',
    baseHeaders: {},
  });
};
