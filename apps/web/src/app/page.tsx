'use client';
import { ContentHeader } from '@billing/web/components/ContentHeader';
import { Typography } from '@billing/ui/src/components/typography';
import { useApiClient } from '../helpers/api';
import { ApisView } from '../components/apis/ApisView';
import { AppContainer } from '../components/AppContainer';

export default function Home() {
  const client = useApiClient();

  const { data, error } = client.health.useQuery(['health']);

  return (
    <>
      <ContentHeader>
        <Typography.h1>Your list 123</Typography.h1>
      </ContentHeader>
      <AppContainer>
        <ApisView />
      </AppContainer>
    </>
  );
}
