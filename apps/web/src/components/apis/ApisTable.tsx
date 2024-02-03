import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@billing/ui/src/components/table';
import { useApiClient } from '@billing/web/helpers/api';

export const ApisTable = () => {
  const client = useApiClient();

  const { data, error, isLoading } = client.api.getApis.useQuery(['get-apis']);
  const apiItems = data?.status === 200 ? data.body : [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Actions</TableHead>
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
              <TableCell>{api.id}</TableCell>
              <TableCell>Actions</TableCell>
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
  );
};
