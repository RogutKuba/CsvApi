import { ServerError } from '@billing/backend-common/errors/serverError';
import { S3DataTypes } from './S3.types';

export const getDataSchema = async (params: {
  headerRow: string;
  firstRow: string;
  fieldDelimeter: string;
}): Promise<{ field: string; type: string }[]> => {
  const { headerRow, firstRow, fieldDelimeter } = params;

  const fields = headerRow.split(fieldDelimeter).map((i) => trimString(i));
  const rowValues = firstRow.split(fieldDelimeter).map((i) => trimString(i));

  if (fields.length !== rowValues.length) {
    throw new ServerError({
      message: 'Fields in header does not match number of data values!',
    });
  }

  console.log({
    fields,
    rowValues,
  });

  return fields.map((field, index) => {
    return {
      field,
      type: getFieldType(rowValues[index]),
    };
  });
};

const trimString = (s: string) => {
  return s.trim().replace('"', '').replace(/\"/g, '');
};

const isFloat = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value);
};

const isInt = (value: string): boolean => {
  return /^\d+$/.test(value);
};

const getFieldType = (value: string): S3DataTypes => {
  if (value === 'true' || value === 'false') {
    return 'bool';
  }

  if (isFloat(value)) {
    return 'float';
  } else if (isInt(value)) {
    return 'int';
  } else {
    return 'string';
  }
};
