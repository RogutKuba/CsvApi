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
  const client = useApiClient();

  const handleReplace = async () => {
    console.log('Replace file');

    const res = await client.api.updateApiData.mutation({
      params: {
        id: '12',
      },
      body: {
        file: new Blob(),
      },
    });

    if (res.status === 200) {
      console.log('File replaced');
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Typography.h4>Replace file</Typography.h4>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
