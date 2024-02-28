import './src/env.mjs';
import nextMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@starter/ui', '@starter/api-tools'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

const withMdx = nextMDX();
export default withMdx(nextConfig);
