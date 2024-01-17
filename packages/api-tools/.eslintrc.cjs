module.exports = {
  extends: ["@starter/eslint-config-custom/server"],
  ignorePatterns: ["src/generated/*"],
  settings: {
    "import/core-modules": ["@starter/api-tools"],
  },
};
