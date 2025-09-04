// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// module.exports = {
//   // ... other config
//   experimental: {
//     allowedDevOrigins: ["192.168.1.123", "localhost"] // Add all allowed origins
//   }


// }

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration optimisée pour Vercel
  images: {
    unoptimized: true,
    domains: ['https://cadastre-backend-3whj.onrender.com'],
  },
  env: {
    API_URL: process.env.API_URL,
  },
  // Important pour les redirections et rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  // Pour le support des monorepos (si applicable)
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig