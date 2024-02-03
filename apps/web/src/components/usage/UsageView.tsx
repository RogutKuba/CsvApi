import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@billing/ui/src/components/card';
import { useApiClient } from '@billing/web/helpers/api';
import dayjs from 'dayjs';

export const UsageView = () => {
  const client = useApiClient();

  const { data, error, isLoading } = client.user.getUser.useQuery(['get-user']);
  const usageData = data?.status === 200 ? data.body : null;

  return (
    <>
      <Card className='w-full'>
        <CardHeader className='pt-4 pb-2'>
          <CardTitle className='text-base font-normal'>
            Number of APIs
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-4'>
          <div className='flex items-end'>
            <p className='text-2xl font-bold'>{usageData?.account.numApis}</p>
            <p className='text-sm font-muted ml-1 mb-1'>
              / {usageData?.subscriptionPlan.allowedApis}
            </p>
          </div>
          <p className='text-xs text-muted-foreground'>
            Since {dayjs().format('DD/MM/YYYY')}
          </p>
        </CardContent>
      </Card>
      <Card className='w-full'>
        <CardHeader className='pt-4 pb-2'>
          <CardTitle className='text-base font-normal'>
            Number of Requests
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-4'>
          <div className='flex items-end'>
            <p className='text-2xl font-bold'>
              {usageData?.account.numRequests}
            </p>
            <p className='text-sm font-muted ml-1 mb-1'>
              / {usageData?.subscriptionPlan.allowedRequests}
            </p>
          </div>
          <p className='text-xs text-muted-foreground'>
            Since {dayjs().format('DD/MM/YYYY')}
          </p>
        </CardContent>
      </Card>
    </>
  );
};
