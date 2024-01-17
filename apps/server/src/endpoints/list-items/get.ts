import { ListItemsQueryGetRouteType } from "@starter/api-routes/routes/list-items/get";
import { db } from "@starter/database/db";
import { listItems } from "@starter/database/schemas/rollup";
import { eq } from "drizzle-orm";
import { specFactory } from "@server/specFactory";

export const ListItemsQueryRoute = specFactory.createRouteSpec({
  ...ListItemsQueryGetRouteType,
  handler: async (ctx, next) => {
    const userId = ctx.state.user.id;

    // fetch list items from database
    const listItemsRes = await db
      .select()
      .from(listItems)
      .where(eq(listItems.userId, userId));

    ctx.body = listItemsRes;

    await next();
  },
});
