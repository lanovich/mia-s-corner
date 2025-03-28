import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "bnwhijouenwykeezlhxx.supabase.co" }],
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
