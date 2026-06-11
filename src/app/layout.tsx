import type { Metadata, Viewport } from 'next'
import { Sora, Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/common/SmoothScroll'
import CustomCursor from '@/components/common/CustomCursor'
import Navbar from '@/components/layout/Navbar'
import ClientPreloader from '@/components/loading/ClientPreloader'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'PREPOC Technologies | Premium Digital Agency',
  description:
    'PREPOC Technologies is an award-winning full-service digital agency specializing in Digital Marketing, SEO, Web Development, Mobile Apps, AI Solutions, and Business Automation. Scale your business with us.',
  keywords: [
    'digital agency',
    'digital marketing',
    'performance marketing',
    'SEO',
    'branding',
    'web development',
    'mobile app development',
    'AI solutions',
    'business automation',
    'PREPOC Technologies',
  ],
  authors: [{ name: 'PREPOC Technologies' }],
  creator: 'PREPOC Technologies',
  publisher: 'PREPOC Technologies',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prepoc.com',
    title: 'PREPOC Technologies | Premium Digital Agency',
    description:
      'Award-winning digital agency helping businesses scale through Digital Marketing, SEO, Web Development, Mobile Apps, AI Solutions, and Business Automation.',
    siteName: 'PREPOC Technologies',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PREPOC Technologies — Premium Digital Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PREPOC Technologies | Premium Digital Agency',
    description:
      'Award-winning digital agency helping businesses scale through Digital Marketing, SEO, Web Development, Mobile Apps, AI Solutions.',
    creator: '@prepoctech',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://prepoc.com',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PREPOC Technologies',
              url: 'https://prepoc.com',
              logo: 'https://prepoc.com/logo.png',
              description:
                'Award-winning full-service digital agency specializing in Digital Marketing, SEO, Web Development, and AI Solutions.',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-555-000-0000',
                contactType: 'customer service',
                email: 'hello@prepoc.com',
              },
              sameAs: [
                'https://linkedin.com/company/prepoc',
                'https://twitter.com/prepoctech',
                'https://instagram.com/prepoctech',
              ],
            }),
          }}
        />
      </head>
      <body className="font-body bg-bg text-foreground antialiased">
        <ClientPreloader />
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
