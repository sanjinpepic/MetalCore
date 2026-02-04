/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use standalone output for Railway deployment
  output: 'standalone',
  // If you need to deploy to a subdirectory (e.g., GitHub Pages)
  // basePath: '/MetalCore-AI',
  // assetPrefix: '/MetalCore-AI/',
}

module.exports = nextConfig
