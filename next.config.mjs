/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix: Use memory cache to prevent NTFS file-lock / stale chunk corruption on Windows
  webpack: (config) => {
    config.cache = { type: "memory" };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eoufiwxmxxhxkxzcswyz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Compress responses
  compress: true,
  // Powered-by header removed for security
  poweredByHeader: false,
  // Security & caching headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: "/(.*)\\.(ico|png|jpg|jpeg|webp|svg|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
