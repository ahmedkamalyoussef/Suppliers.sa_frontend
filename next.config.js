/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Force disable export mode
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
