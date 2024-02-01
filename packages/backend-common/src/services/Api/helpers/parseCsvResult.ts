export const parseCsvResult = (rawCsvData: string) => {
  // want to return in JSON format
  const rows = rawCsvData.split('\n');
  if (rows.length == 0) return [];

  const header = rows[0];
  const fields = header.split(',').map((i) => trimString(i));

  return rows.splice(1).map((r) => {
    const rowData = r.split(', ').map((i) => parseFieldIntoType(trimString(i)));
    return fields.reduce((prev, field, index) => {
      prev[field] = rowData[index];
      return prev;
    }, {} as { [key: string]: any });
  });
};

const trimString = (s: string) => {
  return s.trim().replace('"', '').replace(/\"/g, '');
};

const parseFieldIntoType = (field: string) => {
  const number = Number(field);

  if (!isNaN(number)) {
    return number;
  }

  return field;
};
