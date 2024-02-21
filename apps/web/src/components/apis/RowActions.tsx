import { ApiModel } from '@billing/api-routes';
import { Button } from '@billing/ui/src/components/button';
import { MagicWandIcon, TrashIcon } from '@radix-ui/react-icons';
import { z } from 'zod';
import { DeleteDialog } from './dialog/DeleteDialog';
import { QueryDialog } from './dialog/QueryDialog';

interface Props {
  api: z.infer<typeof ApiModel>;
}

export const RowActions = ({ api }: Props) => {
  return (
    <div className='flex justify-end gap-2'>
      <QueryDialog api={api}>
        <Button variant='outline' size='icon'>
          <MagicWandIcon className='h-4 w-4' />
        </Button>
      </QueryDialog>

      <DeleteDialog apiId={api.id}>
        <Button variant='outline' size='icon'>
          <TrashIcon className='h-4 w-4' />
        </Button>
      </DeleteDialog>
    </div>
  );
};
