import type { Metadata, Viewport } from 'next'
import { Sora, Inter, Outfit } from 'next/font/google'
import './globals.css'
import LeadCapturePopup from '@/components/ui/LeadCapturePopup'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
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
  metadataBase: new URL('https://prepoc.in'),
  title: 'PREPOC Technologies | Premium Digital Agency',
  description:
    'PREPOC Technologies is an award-winning full-service digital agency specializing in Digital Marketing, SEO, Web Development, Mobile Apps, AI Solutions, and Business Automation.',
  authors: [{ name: 'PREPOC Technologies' }],
  creator: 'PREPOC Technologies',
  publisher: 'PREPOC Technologies',
  icons: {
    icon: '/favicon.svg',
  },
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
    siteName: 'PREPOC Technologies',
    title: 'PREPOC Technologies | Premium Digital Agency',
    description:
      'Award-winning full-service digital agency specializing in Digital Marketing, SEO, Web Development, Mobile Apps, AI Solutions, and Business Automation.',
    url: 'https://prepoc.in',
    images: [{ url: '/images/default-og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PREPOC Technologies | Premium Digital Agency',
    description:
      'Award-winning full-service digital agency specializing in Digital Marketing, SEO, Web Development, Mobile Apps, AI Solutions, and Business Automation.',
    images: ['/images/default-og.jpg'],
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
      className={`${sora.variable} ${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <LeadCapturePopup />
      </body>
    </html>
  )
}
