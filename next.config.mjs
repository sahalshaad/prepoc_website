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
    cpus: 4,
    workerThreads: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  serverExternalPackages: ['sharp', 'fluent-ffmpeg', '@ffmpeg-installer/ffmpeg'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://randomuser.me https://images.unsplash.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self';"
          }
        ]
      }
    ]
  }
}

export default nextConfig
