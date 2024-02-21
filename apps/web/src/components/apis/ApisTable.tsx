import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@billing/ui/src/components/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@billing/ui/src/components/tooltip';
import { Typography } from '@billing/ui/src/components/typography';
import { useApiClient } from '@billing/web/helpers/api';
import { ComponentNoneIcon, CopyIcon } from '@radix-ui/react-icons';
import { RowActions } from './RowActions';
import { Button } from '@billing/ui/src/components/button';
import { useToast } from '@billing/ui/src/components/use-toast';
import { env } from '@billing/web/env.mjs';

export const ApisTable = () => {
  const client = useApiClient();
  const { toast } = useToast();

  const { data, error, isLoading } = client.api.getApis.useQuery(['get-apis']);
  const apiItems = data?.status === 200 ? data.body : [];

  const copyText = (entryText) => {
    navigator.clipboard.writeText(entryText);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  return (
    <>
      <Table className='rounded-md overflow-hidden'>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>Loading ...</TableCell>
            </TableRow>
          ) : null}

          {apiItems.map((api) => {
            return (
              <TableRow key={api.id}>
                <TableCell>{api.fileName}</TableCell>
                <TableCell>
                  <div
                    className='flex items-center'
                    onClick={() => copyText(formatIdToUrl(api.id))}
                  >
                    <Typography.p className='text-blue-500 hover:underline cursor-pointer'>
                      {formatIdToUrl(api.id)}
                    </Typography.p>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='p-1 hover:bg-gray-200 rounded-lg cursor-pointer'>
                          <CopyIcon />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Typography.p>Click to copy</Typography.p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <RowActions api={api} />
                </TableCell>
              </TableRow>
            );
          })}

          {error ? (
            <TableRow>
              <TableCell>Got error</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      {apiItems.length === 0 ? (
        <div className='flex flex-col justify-center items-center p-6 gap-2'>
          <ComponentNoneIcon className='w-8 h-8 text-gray-400' />
          <Typography.muted>No APIs found</Typography.muted>
          <Button variant='secondary'>Upload file</Button>
        </div>
      ) : null}
    </>
  );
};

const formatIdToUrl = (id: string) => {
  return `${env.NEXT_PUBLIC_API_URL}/api/${id}`;
};
