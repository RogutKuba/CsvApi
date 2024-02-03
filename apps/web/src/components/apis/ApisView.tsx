import { Button } from '@billing/ui/src/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@billing/ui/src/components/card';
import { Upload } from 'lucide-react';
import { ApisTable } from './ApisTable';

export const ApisView = () => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Your APIs</CardTitle>
          <Button size='default'>
            <Upload className='mr-2 h-4 w-4' />
            Upload CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ApisTable />
      </CardContent>
    </Card>
  );
};
