/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.slice(8),
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
};

module.exports = nextConfig;
