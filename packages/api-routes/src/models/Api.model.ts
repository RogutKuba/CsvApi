import { z } from 'zod';

export const ApiModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  accountId: z.string(),
  fileName: z.string(),
  fileKey: z.string(),
  isActive: z.number(),
  schema: z.array(
    z.object({
      field: z.string(),
      type: z.string(),
    })
  ),
  fieldDelimeterSpace: z.number(),
});
