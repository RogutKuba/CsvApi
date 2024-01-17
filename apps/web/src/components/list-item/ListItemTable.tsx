import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@starter/ui/src/components/table";
import { ListItemDrawer } from "@starter/web/components/list-item/ListItemDrawer";
import { ListItem } from "@starter/web/types/listItem";
import { useState } from "react";

interface Props {
  listItems: ListItem[];
}

export const ListItemTable = ({ listItems }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | undefined>(
    undefined
  );

  return (
    <>
      <ListItemDrawer
        open={open}
        setOpen={setOpen}
        selectedItem={selectedItem}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listItems.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setOpen(true);
              }}
            >
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.completed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
