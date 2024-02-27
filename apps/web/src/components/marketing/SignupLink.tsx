'use client';

import { DropdownMenuItem } from '@billing/ui/src/components/dropdown-menu';
import { useAuthClient } from '@billing/web/helpers/api';
import { useRouter } from 'next/navigation';

export const SignupLink = () => {
  const authClient = useAuthClient();
  const router = useRouter();

  const redirectToLogin = async () => {
    const res = await authClient.authRedirect.query();

    if (res.status === 302) {
      router.push(res.body.redirect);
    }
  };

  return (
    <DropdownMenuItem
      className='text-primary'
      onClick={() => redirectToLogin()}
    >
      Get Started
    </DropdownMenuItem>
  );
};
