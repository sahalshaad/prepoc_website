import type { Metadata } from 'next'
import SmoothScroll from '@/components/common/SmoothScroll'
import CustomCursor from '@/components/common/CustomCursor'
import Navbar from '@/components/layout/Navbar'
import ClientPreloader from '@/components/loading/ClientPreloader'

export const metadata: Metadata = {
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

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientPreloader />
      <SmoothScroll>
        <CustomCursor />
        <Navbar />
        {children}
      </SmoothScroll>
    </>
  )
}
