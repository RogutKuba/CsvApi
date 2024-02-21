import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@billing/ui/src/components/dialog';
import { Typography } from '@billing/ui/src/components/typography';
import { useApiClient } from '@billing/web/helpers/api';

interface Props {
  apiId: string;
  children: React.ReactNode;
}

export const ReplaceDialog = ({ apiId, children }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Typography.h4>Replace file</Typography.h4>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
