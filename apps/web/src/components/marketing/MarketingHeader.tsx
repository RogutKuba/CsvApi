'use client';
import { Typography } from '@billing/ui/src/components/typography';
import { Button } from '@billing/ui/src/components/button';
import { ContentHeader } from '../ContentHeader';
import { useRouter } from 'next/navigation';
import { useAuthClient } from '@billing/web/helpers/api';

export const MarketingHeader = () => {
  const authClient = useAuthClient();
  const router = useRouter();

  const redirectToLogin = async () => {
    const res = await authClient.authRedirect.query();

    if (res.status === 302) {
      router.push(res.body.redirect);
    }
  };

  return (
    <ContentHeader>
      <Typography.h1>CSV2API</Typography.h1>
      <Button onClick={() => redirectToLogin()}>Get Started</Button>
    </ContentHeader>
  );
};
