/** @type {import('next').NextConfig} */
const isAppBuild = process.env.IS_APP_BUILD === 'true';

const nextConfig = {
  // Uncomment the line below when you are ready to build for Capacitor/Xcode
  output: 'export', // Force this manually for a second to test locally
  distDir: 'out',   // Ensure this matches your capacitor.config.ts  
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, 
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("sequelize", "pg", "pg-hstore");
    }
    return config;
  },
};

module.exports = nextConfig;