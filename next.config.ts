import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

module.exports = {
  // ... other config
  experimental: {
    allowedDevOrigins: ["192.168.1.123", "localhost"] // Add all allowed origins
  }


}

export default nextConfig;
