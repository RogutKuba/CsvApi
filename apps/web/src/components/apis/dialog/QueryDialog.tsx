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
import { set, z } from 'zod';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@billing/ui/src/components/tooltip';
import { ApiModel } from '@billing/api-routes';
import { useState } from 'react';
import { QueryResult } from './QueryResult';
import { env } from '@billing/web/env.mjs';
import Cookies from 'js-cookie';
import {
  ClipboardCopyIcon,
  CopyIcon,
  PlusCircledIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { Input } from '@billing/ui/src/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@billing/ui/src/components/select';
import { useToast } from '@billing/ui/src/components/use-toast';

interface Props {
  api: z.infer<typeof ApiModel>;
  children: React.ReactNode;
}

export const QueryDialog = ({ api, children }: Props) => {
  const [url, setUrl] = useState(`${env.NEXT_PUBLIC_API_URL}/api/${api.id}`);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const copyText = (entryText) => {
    navigator.clipboard.writeText(entryText);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  const handleQuery = async () => {
    setLoading(true);
    setData(null);

    const authToken = Cookies.get('x-auth-token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    setData(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        </DialogTrigger>
        <TooltipContent>
          <Typography.p>Query playground</Typography.p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <Typography.h4>Query your API</Typography.h4>
        </DialogHeader>

        <DialogDescription>
          <Typography.p>Test your API with a query.</Typography.p>
        </DialogDescription>

        <div className='flex items-center' onClick={() => copyText(url)}>
          <Typography.p className='text-blue-500 hover:underline cursor-pointer break-all'>
            {url}
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

        <QueryFilters setUrl={setUrl} apiId={api.id} />

        <QueryResult data={data} loading={loading} />

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleQuery} loading={loading}>
            Query
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface QueryFiltersProps {
  apiId: string;
  setUrl: (url: string) => void;
}

const QueryFilters = ({ apiId, setUrl }: QueryFiltersProps) => {
  const { toast } = useToast();

  const [filters, setFilters] = useState<
    {
      field: string;
      operator: '>' | '>=' | '<' | '<=' | '=';
      value: string;
    }[]
  >([]);
  const [field, setField] = useState('');
  const [operator, setOperator] = useState<'>' | '>=' | '<' | '<=' | '='>('=');
  const [value, setValue] = useState('');

  const handleAddFilter = () => {
    const newFilters = [...filters, { field, operator, value }];
    setFilters(newFilters);

    // add filters to where param in url
    const url = `${env.NEXT_PUBLIC_API_URL}/api/${apiId}`;
    const param =
      newFilters.length > 0
        ? `?filters=${newFilters
            .map((f) => `${f.field}${f.operator}${f.value}`)
            .join('and')}`
        : '';
    setUrl(url + param);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);

    setFilters(newFilters);

    // add filters to where param in url
    const url = `${env.NEXT_PUBLIC_API_URL}/api/${apiId}`;

    const param =
      newFilters.length > 0
        ? `?filters=${newFilters
            .map((f) => `${f.field}${f.operator}${f.value}`)
            .join('and')}`
        : '';
    setUrl(url + param);
  };

  return (
    <div className='flex flex-col gap-2 max-h-[15vh] overflow-y-scroll'>
      <div className='flex flex-col '>
        {filters.map((filter, index) => (
          <div key={index} className='flex gap-2 items-center'>
            <Typography.p>{filter.field}</Typography.p>
            <Typography.p>{filter.operator}</Typography.p>
            <Typography.p>{filter.value}</Typography.p>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleRemoveFilter(index)}
            >
              <TrashIcon className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>

      <div className='flex gap-2'>
        <Input
          type='text'
          placeholder='Field name'
          className='w-[120px]'
          onChange={(e) => setField(e.target.value)}
        />
        <Select value={operator} onValueChange={(v) => setOperator(v as any)}>
          <SelectTrigger className='w-[70px]'>
            <SelectValue placeholder='Select a datatype' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='<'>{'<'}</SelectItem>
            <SelectItem value='<='>{'<='}</SelectItem>
            <SelectItem value='='>{'='}</SelectItem>
            <SelectItem value='>='>{'>='}</SelectItem>
            <SelectItem value='>'>{'>'}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type='text'
          placeholder='Value'
          className='w-[120px]'
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          variant='outline'
          size='icon'
          onClick={handleAddFilter}
          disabled={field.length === 0 || value.length === 0}
        >
          <PlusCircledIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
