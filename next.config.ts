import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "toka-store.com",
        pathname: "/**", // ✅ يسمح بأي مسار داخل toka-store.com
      },
      {
        protocol: "https",
        hostname: "fnwuinrbqxprspojcsyj.supabase.co",
        pathname: "/**", // ✅ يسمح بأي مسار داخل lh3.googleusercontent.com
      },
    ],
  },
};

export default nextConfig;
