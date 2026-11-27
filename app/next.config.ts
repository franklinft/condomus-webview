import type { NextConfig } from "next";
import { Environment } from "src/shared/config/environment";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: Environment.webViewUrl
    ? [Environment.webViewUrl]
    : [],
  output: 'export',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
