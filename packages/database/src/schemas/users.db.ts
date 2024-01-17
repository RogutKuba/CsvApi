import {
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),
  workOsId: text("work_os_id").notNull(),
  createdAt: datetime("created_at").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  maxListItems: int("max_list_items").notNull(),
});

export type UserEntity = typeof users.$inferSelect;
