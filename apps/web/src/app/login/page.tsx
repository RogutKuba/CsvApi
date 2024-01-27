'use client';
import { useLocalApiClient } from '@billing/web/providers/api';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  const api = useLocalApiClient();

  useEffect(() => {
    const redirectToLogin = async () => {
      await api.auth.get();
    };

    redirectToLogin();
  }, [api.auth]);

  return (
    <div className='flex flex-grow justify-center items-center'>
      <Loader2 className='h-8 w-8 animate-spin' />
    </div>
  );
}
