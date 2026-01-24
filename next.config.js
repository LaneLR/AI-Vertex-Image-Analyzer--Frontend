/** @type {import('next').NextConfig} */
const isAppBuild = process.env.IS_APP_BUILD === "true";

const nextConfig = {
  // Uncomment the line below when you are ready to build for Capacitor/Xcode
  // output: "export", // Force this manually for a second to test locally
  // distDir: "out", // Ensure this matches your capacitor.config.ts
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
