import { Button } from '@billing/ui/src/components/button';
import { Checkbox } from '@billing/ui/src/components/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@billing/ui/src/components/dialog';
import { Dropzone } from '@billing/ui/src/components/dropzone';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '@billing/ui/src/components/form';
import { Typography } from '@billing/ui/src/components/typography';
import { toast } from '@billing/ui/src/components/use-toast';
import { useApiClient } from '@billing/web/helpers/api';
import Link from 'next/link';
import { useState } from 'react';
import { CreateForm, CreateFormSchema } from './CreateForm';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  children: React.ReactNode;
}

export const CreateDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiClient = useApiClient();

  const { refetch: refetchApis } = apiClient.api.getApis.useQuery(['get-apis']);

  const form = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      fieldDelimeterSpace: true,
      file: [],
    },
  });

  const handleCreate = async () => {
    const { file, fieldDelimeterSpace } = form.getValues();

    if (file.length !== 1) {
      return;
    }

    setLoading(true);

    try {
      // convert fileurl to file
      let blob = await fetch(file[0].url).then((r) => r.blob());

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('fileName', file[0].name);
      formData.append(
        'fieldDelimeterSpace',
        fieldDelimeterSpace ? 'true' : 'false'
      );

      const res = await apiClient.api.createApi.mutation({
        body: formData,
      });

      if (res.status === 200) {
        toast({
          title: 'API Created',
          description: 'Your API has been created successfully',
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Typography.h4>Create API</Typography.h4>
        </DialogHeader>

        <CreateForm form={form} />

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            loading={loading}
            disabled={form.getValues().file.length === 0}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
