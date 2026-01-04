/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // 🎯 تم التعليق عليه مؤقتاً لحل مشاكل الـ static export
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // Exclude API routes from static export
  trailingSlash: true,
  // distDir: 'out', // تم التعليق عليه أيضاً
};

module.exports = nextConfig;
