import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "fnwuinrbqxprspojcsyj.supabase.co",
        pathname: "/**",
      },
      // fallback لأي صور Supabase أخرى محتملة
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
