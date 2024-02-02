import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@billing/ui/src/components/table';

export const ApisTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
};
