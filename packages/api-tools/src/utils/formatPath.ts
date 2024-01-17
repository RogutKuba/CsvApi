export const formatPath = (path: string) => {
  const parts = path.split("/");
  const formattedParts = parts.map((part) => {
    if (part.startsWith(":")) {
      return `_${part.slice(1)}_`;
    }
    return part;
  });
  return formattedParts.join("/");
};
