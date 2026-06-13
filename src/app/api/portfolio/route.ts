import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { PortfolioProject } from '@/types/admin'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json')
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    const dataJson = JSON.parse(fileContent)
    
    // Filter to only include published projects
    const allProjects = (dataJson.PORTFOLIO_PROJECTS || []) as PortfolioProject[]
    const publishedProjects = allProjects.filter((p) => p.status === 'published')
    
    // Select specific fields safe for public exposure
    const publicData = publishedProjects.map((p) => ({
      id: p.id,
      title: p.title,
      clientName: p.clientName,
      industry: p.industry,
      description: p.description,
      bg: p.bg,
      resultsAchieved: p.resultsAchieved,
      tags: p.tags,
      isFeatured: p.isFeatured,
      slug: p.slug,
      coverImage: p.coverImage,
      gallery: p.gallery,
      updatedAt: p.updatedAt,
      createdAt: p.createdAt
    }))

    return NextResponse.json({ success: true, data: publicData })
  } catch (err) {
    console.error('Failed to load portfolio data:', err)
    return NextResponse.json({ success: false, error: 'Failed to load portfolio data' }, { status: 500 })
  }
}
