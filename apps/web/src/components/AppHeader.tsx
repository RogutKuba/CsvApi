import { Typography } from '@billing/ui/src/components/typography';
import { ContentHeader } from './ContentHeader';
import { Button } from '@billing/ui/src/components/button';
import { useAuthClient } from '../helpers/api';
import { useRouter } from 'next/router';

export const AppHeader = () => {
  const authClient = useAuthClient();
  const router = useRouter();

  const redirectToLogin = async () => {
    const data = await authClient.authRedirect.query();

    if (data.status === 302) {
      console.log('body', data.body);

      router.push(data.body.redirect);
    }
  };

  return (
    <ContentHeader>
      <Typography.h1>Your list 123</Typography.h1>
      <Button onClick={redirectToLogin}>Get Started</Button>
    </ContentHeader>
  );
};
