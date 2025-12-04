/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 🎯 تمت إضافة هذا السطر لتمكين التصدير الثابت
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // Exclude API routes from static export
  trailingSlash: true,
  distDir: 'out',
};

module.exports = nextConfig;
