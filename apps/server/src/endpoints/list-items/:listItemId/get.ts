import { ListItemsGetRouteType } from "@starter/api-routes/routes/list-items/_listItemId_/get";
import { db } from "@starter/database/db";
import { listItems } from "@starter/database/schemas/rollup";
import { and, eq } from "drizzle-orm";
import { specFactory } from "@server/specFactory";
import { BadRequestError } from "@server/errors/server.errors";

export const ListItemsGetRoute = specFactory.createRouteSpec({
  ...ListItemsGetRouteType,
  handler: async (ctx, next) => {
    const listItemId = ctx.request.params.listItemId;
    const userId = ctx.state.user.id;

    // fetch list items from database
    const listItemsRes = await db
      .select()
      .from(listItems)
      .where(and(eq(listItems.id, listItemId), eq(listItems.userId, userId)));
    if (!listItemsRes.length) {
      throw new BadRequestError();
    }
    const listItem = listItemsRes[0];

    ctx.body = listItem;

    await next();
  },
});
