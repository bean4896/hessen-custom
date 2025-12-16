/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // `domains` is deprecated in Next 16 – use `remotePatterns` instead
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'hessen.sg',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // TypeScript options
  typescript: {
    ignoreBuildErrors: false,
  },
  // Turbopack is enabled by default in Next 16; no custom webpack config needed
  turbopack: {},
};

module.exports = nextConfig;
