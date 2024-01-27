import { env } from '@billing/backend-common/env';

export const getBucketName = (name: string) => {
  return `${env.AWS_PARENT_BUCKET_NAME}/${name}`;
};
