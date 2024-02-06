'use client';
import { ContentHeader } from '@billing/web/components/ContentHeader';
import { Typography } from '@billing/ui/src/components/typography';
import { useApiClient, useAuthClient } from '../helpers/api';
import { ApisView } from '../components/apis/ApisView';
import { AppContainer } from '../components/AppContainer';
import { UsageView } from '../components/usage/UsageView';
import { Button } from '@billing/ui/src/components/button';
import { useRouter } from 'next/navigation';
import { UpgradeView } from '../components/misc/UpgradeView';
import { useState } from 'react';

export default function Home() {
  const client = useApiClient();
  const authClient = useAuthClient();
  const router = useRouter();

  const { data, error } = client.health.useQuery(['health']);
  const [loading, setLoading] = useState(false);

  const redirectToLogin = async () => {
    setLoading(true);
    const data = await authClient.authRedirect.query();

    if (data.status === 302) {
      console.log('body', data.body);

      router.push(data.body.redirect);
    }
  };

  return (
    <>
      <ContentHeader>
        <Typography.h2>Your list 123</Typography.h2>
        <Button onClick={redirectToLogin} loading={loading}>
          Get Started
        </Button>
      </ContentHeader>
      <AppContainer>
        <ApisView />
        <div className='w-full flex justify-between items-center gap-8'>
          <UsageView />
          <UpgradeView />
        </div>
      </AppContainer>
    </>
  );
}
