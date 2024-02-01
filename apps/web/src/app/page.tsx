'use client';
import { Button } from '@billing/ui/src/components/button';
import { ContentHeader } from '@billing/web/components/ContentHeader';
import { PlusIcon } from '@radix-ui/react-icons';
import { Typography } from '@billing/ui/src/components/typography';
import { initQueryClient } from '@ts-rest/react-query';
import { appContract } from '@billing/api-routes';
import { useApiClient } from '../helpers/api';
import { CreateSection } from '../components/CreateSection';
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
