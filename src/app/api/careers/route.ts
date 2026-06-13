import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { JobVacancy } from '@/types/admin'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'careersData.json')
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    const dataJson = JSON.parse(fileContent)
    
    // Filter to only include active vacancies
    const allVacancies = (dataJson.VACANCIES || []) as JobVacancy[]
    const activeVacancies = allVacancies.filter((v) => v.isActive)
    
    // Select specific fields safe for public exposure
    const publicData = activeVacancies.map((v) => ({
      id: v.id,
      title: v.title,
      department: v.department,
      location: v.location,
      type: v.type,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities,
      benefits: v.benefits,
      salaryRange: v.salaryRange,
      createdAt: v.createdAt
    }))

    return NextResponse.json({ success: true, data: publicData })
  } catch (err) {
    console.error('Failed to load careers data:', err)
    return NextResponse.json({ success: false, error: 'Failed to load careers data' }, { status: 500 })
  }
}
