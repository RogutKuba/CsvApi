import { Button } from '@billing/ui/src/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@billing/ui/src/components/dialog';
import { Typography } from '@billing/ui/src/components/typography';
import { toast } from '@billing/ui/src/components/use-toast';
import { useApiClient } from '@billing/web/helpers/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@billing/ui/src/components/tooltip';
import { EditForm, EditFormSchema } from './EditForm';
import { ApiModel } from '@billing/api-routes';

interface Props {
  api: z.infer<typeof ApiModel>;
  children: React.ReactNode;
}

export const EditDialog = ({ api, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiClient = useApiClient();

  const { refetch: refetchApis } = apiClient.api.getApis.useQuery(['get-apis']);

  const form = useForm<z.infer<typeof EditFormSchema>>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: {
      fieldDelimeterSpace: true,
      file: [],
      schema: api.schema,
    },
  });

  const handleCreate = async () => {
    const { file, fieldDelimeterSpace, schema } = form.getValues();

    if (form.formState.isDirty === false) {
      return;
    }

    setLoading(true);

    try {
      // convert fileurl to file
      let blob =
        file.length === 1
          ? await fetch(file[0].url).then((r) => r.blob())
          : null;

      const formData = new FormData();
      if (blob) {
        formData.append('file', blob);
        formData.append('fileName', file[0].name);
      }

      formData.append(
        'fieldDelimeterSpace',
        fieldDelimeterSpace ? 'true' : 'false'
      );
      formData.append('dataSchema', JSON.stringify(schema));

      const res = await apiClient.api.updateApi.mutation({
        params: { id: api.id },
        body: formData,
      });

      if (res.status === 200) {
        toast({
          title: 'API updated',
          description: 'Your API has been updated successfully',
        });
        refetchApis();
        setOpen(false);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }

    form.reset();
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        </DialogTrigger>
        <TooltipContent>
          <Typography.p>Edit details</Typography.p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <Typography.h4>Edit API</Typography.h4>
        </DialogHeader>

        <DialogDescription>
          <Typography.p>
            Uploading a new file will replace the existing file. Your API will
            remain on the same endpoint.
          </Typography.p>
        </DialogDescription>

        <EditForm form={form} />

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            loading={loading}
            disabled={form.formState.isDirty === false}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
