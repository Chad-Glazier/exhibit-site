/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: process.env.R2_READONLY_DOMAIN,
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: process.env.R2_PROD_DOMAIN,
        port: "",
        pathname: "/**"
      }
    ],
  }
}

module.exports = nextConfig
