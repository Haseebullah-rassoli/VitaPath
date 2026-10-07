/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/VitaPath" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/VitaPath/" : "",
  images: { unoptimized: true },
};
export default nextConfig;
