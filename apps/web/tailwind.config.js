import baseConfig from '@billing/tailwind-config';

export default {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    '../../packages/ui/src/components/**/*.{ts,tsx,md,mdx}',
  ],
};
