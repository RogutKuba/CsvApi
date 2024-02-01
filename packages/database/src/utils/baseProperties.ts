import { type EntitiesList, generateId, Id } from '@billing/base';
import { text } from 'drizzle-orm/sqlite-core';

export const getBaseProperties = <T extends EntitiesList>(
  obj: EntitiesList
) => ({
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId(obj))
    .$type<Id<T>>(),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
