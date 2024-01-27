import { ListItemsQueryGetRouteType } from '@billing/api-routes/routes/list-items/get';
import { db } from '@billing/database/db';
import { listItems } from '@billing/database/schemas/rollup';
import { eq } from 'drizzle-orm';
import { specFactory } from '@server/specFactory';

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
