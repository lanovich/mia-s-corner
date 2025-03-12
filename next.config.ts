import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.freepik.com",
      },
      { hostname: "i.pinimg.com" },
      { hostname: "cozyhome.ru" },
      { hostname: "bnwhijouenwykeezlhxx.supabase.co" }
    ],
  },
};

export default nextConfig;
