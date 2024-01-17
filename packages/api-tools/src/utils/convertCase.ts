export const convertSnakeCaseToCamelCase = (str: string): string => {
  // eslint-disable-next-line prefer-named-capture-group -- just for this
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};
