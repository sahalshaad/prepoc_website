/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      // Demo team photos — remove after swapping with local assets
      { protocol: 'https', hostname: 'randomuser.me' },
      // Demo gallery images — remove after swapping with local assets
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
