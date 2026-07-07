/** @type {import('next').NextConfig} */
// import.meta.dirname is the ESM equivalent of __dirname (Node 20.11+)
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      // Legacy WP Media / External CDN
      { protocol: 'https', hostname: 'innovix99.ae' },
      // Demo team photos — remove after swapping with local assets
      { protocol: 'https', hostname: 'randomuser.me' },
      // Demo gallery images — remove after swapping with local assets
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    cpus: 1,
    workerThreads: false,
  },
  turbopack: {
    // Scope Turbopack to this project root so it does not scan ancestor
    // directories and find the stub /Users/sahal/package-lock.json.
    // This eliminates the "multiple lockfiles detected" warning.
    // Note: import.meta.dirname is the ESM equivalent of __dirname.
    root: import.meta.dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://prepoc.in',
    ERP_API_URL: process.env.ERP_API_URL || 'https://erp.prepoc.in',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://randomuser.me https://images.unsplash.com https://innovix99.ae; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; frame-src 'self' data: blob:; object-src 'self' data: blob:;"
          }
        ]
      }
    ]
  }
}

export default nextConfig
