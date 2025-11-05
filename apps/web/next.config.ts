import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add path aliases from tsconfig.json to webpack
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './src'),
      };
    }
    return config;
  },
};

export default nextConfig;
