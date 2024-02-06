import { Button } from '@billing/ui/src/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@billing/ui/src/components/card';
import { Upload } from 'lucide-react';
import { ApisTable } from './ApisTable';
import { Typography } from '@billing/ui/src/components/typography';

export const ApisView = () => {
  return (
    <>
      <div className='w-full px-2'>
        <Typography.h1>Your APIs</Typography.h1>
      </div>
      <Card className='w-full'>
        {/* <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Your APIs</CardTitle>
          <Button size='default'>
            <Upload className='mr-2 h-4 w-4' />
            Upload CSV
          </Button>
        </div>
      </CardHeader> */}
        <CardContent className='p-6'>
          <ApisTable />
        </CardContent>
      </Card>
    </>
  );
};
