import { env } from "./env";

export const isProduction = () => env.NODE_ENV === "production";
export const isDevelopment = () => env.NODE_ENV === "development";
export const isTesting = () => env.NODE_ENV === "test";
