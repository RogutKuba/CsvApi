'use client';
import { Typography } from '@billing/ui/src/components/typography';
import { ContentHeader } from './ContentHeader';
import { Button } from '@billing/ui/src/components/button';
import { useApiClient } from '../helpers/api';
import { useAuthHelpers } from '../helpers/auth';

export const AppHeader = () => {
  const apiClient = useApiClient();
  const authHelpers = useAuthHelpers();

  const redirectToBilling = () => {
    // window.location.href = '/billing';
  };

  return (
    <ContentHeader>
      <div className='flex items-center gap-2'>
        <img src='/csv.svg' alt='CSVAPI' height={30} width={30} />
        <Typography.h1>CSVAPI</Typography.h1>
      </div>

      <div className='flex items-center gap-4'>
        {/* <Button onClick={redirectToBilling}>Billing</Button> */}
        <Button variant='outline' onClick={() => authHelpers.logout()}>
          Logout
        </Button>
      </div>
    </ContentHeader>
  );
};
