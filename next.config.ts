import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false,
  images: {
    remotePatterns: [
      { hostname: "bnwhijouenwykeezlhxx.supabase.co" },
      { hostname: "www.mias-corner.ru" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Vercel-Country",
            value: "RU",
          },
          {
            key: "Content-Language",
            value: "ru",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
