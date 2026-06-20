import type { Metadata } from 'next'
import Script from 'next/script'
import SmoothScroll from '@/components/common/SmoothScroll'
import CustomCursor from '@/components/common/CustomCursor'
import Navbar from '@/components/layout/Navbar'
import TopBar from '@/components/layout/TopBar'

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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-JWPWW5TJT2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-JWPWW5TJT2');
        `}
      </Script>

      <SmoothScroll>
        <CustomCursor />
        <div className="relative z-10 flex flex-col min-h-screen">
          <TopBar />
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </SmoothScroll>
    </>
  )
}
