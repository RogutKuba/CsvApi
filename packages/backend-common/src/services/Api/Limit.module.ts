import { Id } from '@billing/base';

export const LimitModule = {
  assertNumberApis: async (params: { accountId: Id<'account'> }) => {
    // assert under api limit
  },
  assertRequests: async (params: { accountId: Id<'account'> }) => {
    // assert under request limit
  },
};
