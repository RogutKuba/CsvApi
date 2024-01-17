import baseConfig from "@starter/tailwind-config";

export default {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    "../../packages/ui/src/components/**/*.{ts,tsx}",
  ],
};
