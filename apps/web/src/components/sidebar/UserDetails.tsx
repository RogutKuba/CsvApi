'use client';
import { ExitIcon } from '@radix-ui/react-icons';
import { Button } from '@billing/ui/src/components/button';
import { Typography } from '@billing/ui/src/components/typography';
import { useAuthHelpers } from '@billing/web/helpers/auth';
import { useState } from 'react';

export const UserDetails = () => {
  const [loading, setLoading] = useState(false);
  const authHelpers = useAuthHelpers();

  const handleLogout = () => {
    setLoading(true);
    console.log('logout');
    authHelpers.logout();
    setLoading(false);
  };

  // fetch user details from cookie
  return (
    <div className='flex w-full justify-center items-center mx-auto'>
      <Button variant='ghost' onClick={handleLogout} disabled={loading}>
        <Typography.p>rogutkuba@gmail.com</Typography.p>
        <ExitIcon className='h-4 w-4 ml-2' />
      </Button>
    </div>
  );
};
