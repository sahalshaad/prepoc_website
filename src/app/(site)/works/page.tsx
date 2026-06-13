import type { Metadata } from 'next'
import fs from 'fs/promises'
import path from 'path'
import WorksClient from '@/components/sections/WorksClient'
import { PortfolioProject } from '@/types/admin'

export const metadata: Metadata = {
  title: 'Our Work | PREPOC Technologies',
  description:
    "Explore PREPOC Technologies' portfolio of web development, digital marketing, branding, and business growth projects.",
  keywords: [
    'PREPOC portfolio',
    'PREPOC case studies',
    'web development portfolio',
    'digital marketing portfolio',
    'branding agency Dubai',
    'AI solutions portfolio',
  ],
  alternates: { canonical: 'https://prepoc.com/works' },
  openGraph: {
    type: 'website',
    url: 'https://prepoc.com/works',
    title: 'Our Work | PREPOC Technologies',
    description:
      "Explore PREPOC Technologies' portfolio of web development, digital marketing, branding, and business growth projects.",
    siteName: 'PREPOC Technologies',
  },
}

export const dynamic = 'force-dynamic'

export default async function WorksPage() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json')
  let projects: PortfolioProject[] = []

  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    const dataJson = JSON.parse(fileContent)
    projects = (dataJson.PROJECTS || []) as PortfolioProject[]
  } catch (err) {
    console.error('Failed to read portfolio data:', err)
  }

  // Pre-sort on the server:
  // 1. Featured first
  // 2. displayOrder ascending (1, 2, 3...)
  // 3. updatedAt/createdAt descending
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1

    const orderA = a.displayOrder ?? 999
    const orderB = b.displayOrder ?? 999
    if (orderA !== orderB) return orderA - orderB

    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return timeB - timeA
  })

  return <WorksClient initialProjects={sortedProjects} />
}
