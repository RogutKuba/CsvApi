import { Button } from '@billing/ui/src/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@billing/ui/src/components/dialog';
import { Typography } from '@billing/ui/src/components/typography';
import { useApiClient } from '@billing/web/helpers/api';
import { useState } from 'react';

interface Props {
  apiId: string;
  children: React.ReactNode;
}

export const DeleteDialog = ({ apiId, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiClient = useApiClient();

  const handleDelete = async () => {
    setLoading(true);
    console.log('Delete file');

    const res = await apiClient.api.deleteApi.mutation({
      params: { id: apiId },
    });

    if (res.status === 200) {
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Typography.h4>Delete API</Typography.h4>
        </DialogHeader>
        <DialogDescription>
          <Typography.p>
            Are you sure you want to delete this API? This action cannot be
            undone.
          </Typography.p>
        </DialogDescription>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
