import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@billing/ui/src/components/button';
import { Input } from '@billing/ui/src/components/input';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@billing/ui/src/components/sheet';
import { ListItem } from '@billing/web/types/listItem';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: ListItem | undefined;
}

export const ListItemDrawer = ({ open, setOpen, selectedItem }: Props) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{selectedItem?.title}</SheetTitle>
          <SheetDescription>{selectedItem?.description}</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <CheckCircledIcon className='h-4 w-4' />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
