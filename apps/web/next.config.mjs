import "./src/env.mjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@starter/ui", "@starter/api-tools"],
};

export default nextConfig;
