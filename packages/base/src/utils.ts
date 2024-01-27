export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () =>
  process.env.NODE_ENV === 'development' || (!isProduction() && !isTesting());
export const isTesting = () => process.env.NODE_ENV === 'test';
