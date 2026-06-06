import type { NextConfig } from "next";
import { Environment } from "src/shared/config/environment";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: [`${Environment.webViewUrl}`],

};

export default nextConfig;
