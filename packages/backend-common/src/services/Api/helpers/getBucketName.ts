import { env } from '@billing/backend-common/env';

export const getBucketName = () => {
  return env.AWS_PARENT_BUCKET_NAME;
};

export const getItemKey = (vals: String[]) => vals.join('/') + '.csv';
