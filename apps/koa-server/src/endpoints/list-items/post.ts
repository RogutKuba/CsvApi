import { ListItemsPostRouteType } from '@billing/api-routes/routes/list-items/post';
import { generateId } from '@billing/base';
import { db } from '@billing/database/db';
import type { ListItemEntity } from '@billing/database/schemas/listItems.db';
import { listItems } from '@billing/database/schemas/listItems.db';
import { specFactory } from '@server/specFactory';

export const ListItemsPostRoute = specFactory.createRouteSpec({
  ...ListItemsPostRouteType,
  handler: async (ctx, next) => {
    const userId = ctx.state.user.id;

    const listItemToInsert: ListItemEntity = {
      id: generateId('listItem'),
      createdAt: new Date(),
      title: ctx.request.body.title,
      description: ctx.request.body.description,
      userId,
      completed: false,
    };

    await db.insert(listItems).values(listItemToInsert);

    ctx.body = {};
    await next();
  },
});
