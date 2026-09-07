/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.coverr.co',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      }
    ],
  },
};

module.exports = nextConfig;
