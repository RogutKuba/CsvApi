import { type EntitiesList, generateId } from '@billing/base';
import { text } from 'drizzle-orm/sqlite-core';

// <T extends keyof Entities>
export const getBaseProperties = (obj: EntitiesList) => ({
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId(obj)),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
