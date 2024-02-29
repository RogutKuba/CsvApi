'use client';
import { Typography } from '@billing/ui/src/components/typography';
import { ContentHeader } from './ContentHeader';
import { Button } from '@billing/ui/src/components/button';
import { useAuthHelpers } from '../helpers/auth';
import Link from 'next/link';

export const AppHeader = () => {
  const authHelpers = useAuthHelpers();

  return (
    <ContentHeader>
      <Link href='/' className='flex items-center gap-2'>
        <img src='/csv.svg' alt='CSVAPI' height={30} width={30} />
        <Typography.h1>CSVAPI</Typography.h1>
      </Link>

      <div className='flex items-center gap-4'>
        <Link href='/blog'>
          <Button variant='ghost'>Blog</Button>
        </Link>
        <Button variant='outline' onClick={() => authHelpers.logout()}>
          Logout
        </Button>
      </div>
    </ContentHeader>
  );
};
