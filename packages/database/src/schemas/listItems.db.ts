import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { z } from "zod";
import { users } from "./users.db";

export const listItems = mysqlTable("list_items", {
  id: varchar("id", { length: 50 }).primaryKey(),
  createdAt: datetime("created_at").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: boolean("completed").notNull(),
  userId: varchar("user_id", { length: 50 }).notNull(),
});

export const listItemRelations = relations(listItems, ({ one }) => ({
  user: one(users, {
    fields: [listItems.userId],
    references: [users.id],
  }),
}));

export type ListItemEntity = typeof listItems.$inferSelect;

export const ListItemZod = z.object({
  id: z.string(),
  createdAt: z.date(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  userId: z.string(),
});
