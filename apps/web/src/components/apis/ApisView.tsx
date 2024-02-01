import { Button } from '@billing/ui/src/components/button';
import { Card, CardHeader, CardTitle } from '@billing/ui/src/components/card';
import { UploadIcon } from '@radix-ui/react-icons';
import { Upload } from 'lucide-react';

export const ApisView = () => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Your APIs</CardTitle>
          <Button size='default'>
            <Upload className='mr-2 h-4 w-4' />
            Upload
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
