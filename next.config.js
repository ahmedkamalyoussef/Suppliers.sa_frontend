/** @type {import('next').NextConfig} */
const nextConfig = {
  output: undefined, // Force disable export mode
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  trailingSlash: false,
};

module.exports = nextConfig;
