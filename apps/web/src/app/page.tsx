"use client";
import { Button } from "@starter/ui/src/components/button";
import { ContentHeader } from "@starter/web/components/ContentHeader";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateListItemDialog } from "@starter/web/components/list-item/CreateListItemDialog";
import { ListItemTable } from "@starter/web/components/list-item/ListItemTable";
import { Typography } from "@starter/ui/src/components/typography";
import { useApiClient } from "@starter/web/providers/api";
import { useEffect, useState } from "react";
import { ListItem } from "@starter/web/types/listItem";

export default function Home() {
  const [data, setData] = useState<ListItem[]>([]);

  const api = useApiClient();

  useEffect(() => {
    const fetchListItems = async () => {
      const res = await api.listItems.get({
        query: {},
        params: {},
        body: undefined,
      });

      if (res.ok) {
        setData(res.data);
      } else {
        console.log("error fetching list items");
      }
    };

    fetchListItems();
  }, [api]);

  return (
    <>
      <ContentHeader>
        <Typography.h1>Your list 123</Typography.h1>
        <CreateListItemDialog>
          <Button>
            <PlusIcon className="mr-2" />
            <span>Add</span>
          </Button>
        </CreateListItemDialog>
      </ContentHeader>
      <div className="">
        <ListItemTable listItems={data} />
      </div>
    </>
  );
}
