import { createError } from "@starter/backend-common/errors/createError";

const base = createError({
  name: "ListItemError",
});

export const ListItemLimitError = base.createError({
  name: "ListItemLimitError",
  status: 422,
  messageData: {
    title: "List item limit reached",
    message: "You have reached the maximum number of list items",
  },
});
