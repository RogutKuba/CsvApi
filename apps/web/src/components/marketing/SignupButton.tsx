'use client';

import { Button } from '@billing/ui/src/components/button';
import { useAuthClient } from '@billing/web/helpers/api';
import { useRouter } from 'next/navigation';

interface Props {
  size?: 'sm' | 'default' | 'lg';
  text: string;
}

export const SignupButton = ({ size, text }: Props) => {
  const authClient = useAuthClient();
  const router = useRouter();

  const redirectToLogin = async () => {
    const res = await authClient.authRedirect.query();

    if (res.status === 302) {
      router.push(res.body.redirect);
    }
  };

  return (
    <Button size={size ?? 'default'} onClick={() => redirectToLogin()}>
      {text}
    </Button>
  );
};
