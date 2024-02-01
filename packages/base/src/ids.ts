import * as crypto from 'node:crypto';

export const Entities = {
  user: 'user',
  secret: 'secr',
  account: 'acc',
  balances: 'bal',
  atomicTransaction: 'at_tx',
  consumer: 'cons',
  api: 'api',
  file: 'file',
  requestLog: 'req_log',
  subscriptionPlan: 'sub_plan',
} as const;

export type EntitiesList = keyof typeof Entities;

type IdsWithPrefixes = {
  [key in keyof typeof Entities]: `${(typeof Entities)[key]}_${string}`;
};

export type Id<T extends keyof typeof Entities> = IdsWithPrefixes[T];

const generateRandomId = (base: number) => {
  return parseInt(crypto.randomBytes(6).toString('hex'), 16)
    .toString(base)
    .slice(0, 7);
};

export const generateId = <T extends keyof typeof Entities>(entity: T) => {
  // let tmp = Entities as any;
  return `${Entities[entity]}_${generateRandomId(36)}` as Id<T>;
};
