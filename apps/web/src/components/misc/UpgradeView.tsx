import { Button } from '@billing/ui/src/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@billing/ui/src/components/card';
import { useApiClient } from '@billing/web/helpers/api';

export const UpgradeView = () => {
  const client = useApiClient();

  const { data, error, isLoading } = client.user.getUser.useQuery(['get-user']);
  const usageData = data?.status === 200 ? data.body : null;

  return (
    <Card className='h-full w-full bg-blue-200 border-blue-300'>
      <CardHeader className='pt-4 pb-2'>
        <CardTitle className='text-base font-normal'>
          Upgrade to get unlimited requests
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-4'>
        <Button>Upgrade</Button>
      </CardContent>
    </Card>
  );
};
