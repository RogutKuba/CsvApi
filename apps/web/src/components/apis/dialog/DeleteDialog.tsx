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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@billing/ui/src/components/tooltip';
import { Typography } from '@billing/ui/src/components/typography';
import { toast } from '@billing/ui/src/components/use-toast';
import { useApiClient } from '@billing/web/helpers/api';
import React, { useState } from 'react';

interface Props {
  apiId: string;
  children: React.ReactNode;
}

export const DeleteDialog = ({ apiId, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiClient = useApiClient();

  const { refetch: refetchApis } = apiClient.api.getApis.useQuery(['get-apis']);

  const handleDelete = async () => {
    setLoading(true);

    const res = await apiClient.api.deleteApi.mutation({
      params: { id: apiId },
    });

    if (res.status === 200) {
      toast({
        title: 'API deleted',
        description: 'Your API has been deleted.',
      });
      refetchApis();
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        </DialogTrigger>
        <TooltipContent>
          <Typography.p>Delete API</Typography.p>
        </TooltipContent>
      </Tooltip>
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
