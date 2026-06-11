import type { Metadata } from 'next'
import CustomCursor from '@/components/common/CustomCursor'
import AboutTimeline from '@/components/about/AboutTimeline'
import AboutHero from '@/components/about/AboutHero'
import OurStory from '@/components/about/OurStory'
import LeadershipSpotlight from '@/components/about/LeadershipSpotlight'
import TeamSection from '@/components/about/TeamSection'
import CompanyValues from '@/components/about/CompanyValues'
import OfficeGallery from '@/components/about/OfficeGallery'
import AboutCTA from '@/components/about/AboutCTA'

export const metadata: Metadata = {
  title: 'About PREPOC Technologies | Our Team & Story',
  description:
    'Meet the team behind PREPOC Technologies — a premium digital agency of strategists, designers, developers, and storytellers. Learn our story, values, and the people driving exceptional results.',
  keywords: [
    'PREPOC Technologies team',
    'about PREPOC',
    'digital agency team',
    'who we are',
    'our story',
    'digital agency UAE',
    'creative team',
  ],
  alternates: { canonical: 'https://prepoc.com/about' },
  openGraph: {
    type: 'website',
    url: 'https://prepoc.com/about',
    title: 'About PREPOC Technologies | Our Team & Story',
    description: 'Meet the passionate team behind PREPOC — where strategy, design, and technology converge.',
    siteName: 'PREPOC Technologies',
  },
}

export default function AboutPage() {
  return (
    <>
      <CustomCursor />

      {/* Left-side floating section timeline (desktop only) */}
      <AboutTimeline />

      <main id="main-content">
        <AboutHero />
        <OurStory />
        <LeadershipSpotlight />
        <CompanyValues />
        <TeamSection />
        <OfficeGallery />
        <AboutCTA />
      </main>
    </>
  )
}
