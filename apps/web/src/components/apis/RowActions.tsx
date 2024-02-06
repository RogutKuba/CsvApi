import { ApiModel } from '@billing/api-routes';
import { Button } from '@billing/ui/src/components/button';
import { Dialog } from '@billing/ui/src/components/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@billing/ui/src/components/tooltip';
import { Typography } from '@billing/ui/src/components/typography';
import {
  EyeOpenIcon,
  MagicWandIcon,
  MixIcon,
  Pencil1Icon,
  TableIcon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import { z } from 'zod';
import { ReplaceDialog } from './dialog/ReplaceDialog';
import { DeleteDialog } from './dialog/DeleteDialog';

interface Props {
  api: z.infer<typeof ApiModel>;
}

export const RowActions = ({ api }: Props) => {
  return (
    <div className='flex justify-end gap-2'>
      <Tooltip>
        <TooltipTrigger>
          <Button variant='outline' size='icon'>
            <MagicWandIcon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Typography.p>Query playground</Typography.p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button variant='outline' size='icon'>
            <Pencil1Icon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Typography.p>Edit details</Typography.p>
        </TooltipContent>
      </Tooltip>

      <DeleteDialog apiId={api.id}>
        <Tooltip>
          <TooltipTrigger>
            <Button variant='outline' size='icon'>
              <TrashIcon className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Typography.p>Delete API</Typography.p>
          </TooltipContent>
        </Tooltip>
      </DeleteDialog>
    </div>
  );
};
