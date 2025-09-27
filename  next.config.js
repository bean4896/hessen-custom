/** @type {import('next').NextConfig} */
export default {
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}
