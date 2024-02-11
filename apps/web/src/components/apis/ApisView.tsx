import { Button } from '@billing/ui/src/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@billing/ui/src/components/card';
import { ApisTable } from './ApisTable';
import { Typography } from '@billing/ui/src/components/typography';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { CreateDialog } from './dialog/CreateDialog';

export const ApisView = () => {
  return (
    <>
      <div className='w-full px-2 flex justify-between items-center'>
        <Typography.h1>Your APIs</Typography.h1>
        <CreateDialog>
          <Button variant='outline'>
            <PlusCircledIcon className='w-4 h-4 mr-2' />
            Create API
          </Button>
        </CreateDialog>
      </div>
      <Card className='w-full'>
        <CardContent className='p-6'>
          <ApisTable />
        </CardContent>
      </Card>
    </>
  );
};
