import { db } from "@starter/database/db";
import type {
  ListItemEntity,
  UserEntity} from "@starter/database/schemas/rollup";
import {
  listItems,
} from "@starter/database/schemas/rollup";
import { count, eq } from "drizzle-orm";
import { ListItemLimitError } from "@starter/backend-common/services/ListItem/listItem.errors";

export const ListItemService = {
  createListItem: async (listItem: ListItemEntity, currentUser: UserEntity) => {
    // assert that user has not hit limit
    const existingCount = await db
      .select({
        value: count(),
      })
      .from(listItems)
      .where(eq(listItems.userId, listItem.userId));

    if (existingCount[0].value >= currentUser.maxListItems) {
      throw new ListItemLimitError();
    }

    await db.insert(listItems).values(listItem);
  },
};
