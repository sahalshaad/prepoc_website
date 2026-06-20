import type { Metadata } from 'next'
import fs from 'fs/promises'
import path from 'path'
import AboutTimeline from '@/components/about/AboutTimeline'
import AboutHero from '@/components/about/AboutHero'
import OurStory from '@/components/about/OurStory'
import LeadershipSpotlight from '@/components/about/LeadershipSpotlight'
import TeamSection from '@/components/about/TeamSection'
import CompanyValues from '@/components/about/CompanyValues'
import OfficeGallery from '@/components/about/OfficeGallery'
import AboutCTA from '@/components/about/AboutCTA'
import { type TeamMember } from '@/data/aboutData'

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

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
  const aboutContent = await fs.readFile(aboutPath, 'utf-8')
  const aboutJson = JSON.parse(aboutContent)

  let departments = ['All']
  try {
    const depsContent = await fs.readFile(path.join(process.cwd(), 'src', 'data', 'departmentsData.json'), 'utf-8')
    const deps = JSON.parse(depsContent)
    deps.sort((a: Record<string, unknown>, b: Record<string, unknown>) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
    departments = ['All', ...deps.filter((d: Record<string, unknown>) => d.isActive).map((d: Record<string, unknown>) => d.name as string)]
  } catch (_e) {}

  const members = (aboutJson.TEAM_MEMBERS || []) as TeamMember[]
  
  const founderMembers = members
    .filter((m: TeamMember) => m.isFounder && m.isActive)
    .sort((a: TeamMember, b: TeamMember) => ((a as any).founderOrder ?? 0) - ((b as any).founderOrder ?? 0))

  const founders: import('@/data/leadershipData').Founder[] = founderMembers.length > 0
    ? founderMembers.map((m: TeamMember) => ({
        name: m.name,
        position: m.title,
        message: m.message || '',
        messageExtended: m.messageExtended,
        image: m.image,
        linkedin: m.linkedin,
        credentials: m.credentials || [],
        founderOrder: (m as any).founderOrder ?? 0,
      }))
    : [{
        name: 'Aslam',
        position: 'Founder',
        message: '',
        image: '',
        linkedin: '',
        credentials: [],
      }]

  // Derive Leadership Team members (excluding founders)
  const team = members
    .filter((m: TeamMember) => m.isLeadership && m.isActive && !m.isFounder)
    .map((m: TeamMember) => ({
      id: m.id,
      name: m.name,
      role: m.title,
      image: m.image,
      linkedin: m.linkedin
    }))

  return (
    <>
      {/* Left-side floating section timeline (desktop only) */}
      <AboutTimeline />

      <main id="main-content">
        <AboutHero />
        <OurStory stats={aboutJson.ABOUT_STATS} />
        <LeadershipSpotlight founders={founders} team={team} />
        <CompanyValues values={aboutJson.COMPANY_VALUES} />
        <TeamSection members={members.filter((m: TeamMember) => m.isActive)} colors={aboutJson.DEPARTMENT_COLORS} departments={departments} />
        <OfficeGallery items={aboutJson.GALLERY_ITEMS} />
        <AboutCTA />
      </main>
    </>
  )
}
