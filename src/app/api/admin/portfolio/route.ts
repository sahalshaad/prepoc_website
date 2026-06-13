import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { z } from 'zod'
import { readData, writeData } from '@/lib/dataStore'
import { PortfolioProjectSchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { PortfolioProject } from '@/types/admin'

const BulkPortfolioSchema = z.array(PortfolioProjectSchema)

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json')
    const dataJson = await readData(dataPath, { PROJECTS: [] })
    return NextResponse.json({ success: true, data: dataJson.PROJECTS || [] })
  } catch (err) {
    console.error('Failed to load portfolio items:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { project, projects } = body

    const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json')
    const dataJson = await readData(dataPath, { PROJECTS: [] })

    if (projects) {
      // Validate bulk
      const parseResult = BulkPortfolioSchema.safeParse(projects)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      dataJson.PROJECTS = projects
      await writeData(dataPath, dataJson)
      await logAdminAction('BULK_UPDATE', 'PORTFOLIO', 'all')
    } else if (project) {
      // Validate single
      const parseResult = PortfolioProjectSchema.safeParse(project)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      const existingProjects = (dataJson.PROJECTS || []) as PortfolioProject[]
      const now = new Date().toISOString()

      if (project.id) {
        // Update existing
        const index = existingProjects.findIndex((p: PortfolioProject) => p.id === project.id)
        if (index > -1) {
          const original = existingProjects[index]
          existingProjects[index] = {
            ...original,
            title: project.title,
            clientName: project.clientName,
            industry: project.industry,
            description: project.description,
            resultsAchieved: project.resultsAchieved,
            tags: project.tags || [],
            coverImage: project.coverImage,
            bg: project.bg || original.bg || 'linear-gradient(135deg, #0f0f12 0%, #050505 100%)',
            isFeatured: typeof project.isFeatured === 'boolean' ? project.isFeatured : original.isFeatured,
            status: project.status || original.status || 'published',
            displayOrder: typeof project.displayOrder === 'number' ? project.displayOrder : Number(project.displayOrder || original.displayOrder || 0),
            slug: project.slug || original.slug || project.id,
            updatedAt: now
          }
          await writeData(dataPath, dataJson)
          await logAdminAction('UPDATE', 'PORTFOLIO', project.id, { title: project.title })
        } else {
          return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
        }
      } else {
        // Insert new
        const generatedId = project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`
        
        let finalId = generatedId
        let counter = 1
        while (existingProjects.some((p: PortfolioProject) => p.id === finalId)) {
          finalId = `${generatedId}-${counter}`
          counter++
        }

        const newProject: PortfolioProject = {
          id: finalId,
          title: project.title,
          clientName: project.clientName,
          industry: project.industry,
          description: project.description,
          resultsAchieved: project.resultsAchieved,
          tags: project.tags || [],
          coverImage: project.coverImage || '',
          bg: project.bg || 'linear-gradient(135deg, #0f0f12 0%, #050505 100%)',
          galleryImages: project.galleryImages || [],
          isFeatured: typeof project.isFeatured === 'boolean' ? project.isFeatured : false,
          status: project.status || 'published',
          displayOrder: typeof project.displayOrder === 'number' ? project.displayOrder : Number(project.displayOrder || 0),
          slug: project.slug || finalId,
          createdAt: now,
          updatedAt: now
        }
        existingProjects.push(newProject)
        await writeData(dataPath, dataJson)
        await logAdminAction('CREATE', 'PORTFOLIO', finalId, { title: project.title })
      }
    } else {
      return NextResponse.json({ success: false, error: 'No data provided' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: dataJson.PROJECTS })
  } catch (err) {
    console.error('Failed to save portfolio project(s):', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
