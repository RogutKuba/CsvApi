'use client';
import { useAuthClient } from '@billing/web/helpers/api';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const api = useAuthClient();
  const router = useRouter();

  useEffect(() => {
    const redirectToLogin = async () => {
      const res = await api.authRedirect.query();

      if (res.status === 302) {
        router.push(res.body.redirect);
      }
    };

    redirectToLogin();
  }, []);

  return (
    <div className='flex flex-grow justify-center items-center'>
      <Loader2 className='h-8 w-8 animate-spin' />
    </div>
  );
}
