import * as crypto from "node:crypto";

interface Entities {
  user: "user";
  listItem: "listItem";
}

type IdsWithPrefixes = {
  [key in keyof Entities]: `${Entities[key]}_${string}`;
};

export type Id<T extends keyof Entities> = IdsWithPrefixes[T];

export const generateRandomId = (base: number) => {
  return parseInt(crypto.randomBytes(6).toString("hex"), 16)
    .toString(base)
    .slice(0, 7);
};

export const generateId = <T extends keyof Entities>(entity: T) => {
  return `${entity}_${generateRandomId(36)}` as Id<T>;
};
