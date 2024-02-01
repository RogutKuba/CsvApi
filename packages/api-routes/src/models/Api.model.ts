import { z } from 'zod';

export const ApiModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  accountId: z.string(),
  fileKey: z.string(),
  isActive: z.number(),
});
