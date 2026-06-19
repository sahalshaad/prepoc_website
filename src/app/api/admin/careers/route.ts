import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readData, writeData } from '@/lib/dataStore'
import { JobVacancySchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { JobVacancy } from '@/types/admin'

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'careersData.json')
    const dataJson = await readData(dataPath, { VACANCIES: [] })
    return NextResponse.json({ success: true, data: dataJson.VACANCIES || [] })
  } catch (err) {
    console.error('Failed to load careers data:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { vacancy, action, id } = body

    const dataPath = path.join(process.cwd(), 'src', 'data', 'careersData.json')
    const dataJson = await readData(dataPath, { VACANCIES: [] })
    let existingVacancies = (dataJson.VACANCIES || []) as JobVacancy[]

    if (action === 'delete' && id) {
      existingVacancies = existingVacancies.filter(v => v.id !== id)
      dataJson.VACANCIES = existingVacancies
      await writeData(dataPath, dataJson)
      await logAdminAction('DELETE', 'VACANCY', id)
      return NextResponse.json({ success: true, data: existingVacancies })
    }

    if (vacancy) {
      // Validate
      const parseResult = JobVacancySchema.safeParse(vacancy)
      if (!parseResult.success) {
        const safeErrors = parseResult.error.issues.map(err => ({ path: err.path.join('.'), message: err.message }))
        console.error("JobVacancy Validation Failed:", safeErrors)
        return NextResponse.json({ success: false, error: 'Validation failed', errors: safeErrors }, { status: 400 })
      }

      if (vacancy.id) {
        // Update existing
        const index = existingVacancies.findIndex(v => v.id === vacancy.id)
        if (index > -1) {
          existingVacancies[index] = {
            ...existingVacancies[index],
            ...vacancy,
            updatedAt: new Date().toISOString()
          }
          dataJson.VACANCIES = existingVacancies
          await writeData(dataPath, dataJson)
          await logAdminAction('UPDATE', 'VACANCY', vacancy.id, { title: vacancy.title })
        } else {
          // Insert new with ID
          existingVacancies.push({
            ...vacancy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          dataJson.VACANCIES = existingVacancies
          await writeData(dataPath, dataJson)
          await logAdminAction('CREATE', 'VACANCY', vacancy.id, { title: vacancy.title })
        }
      } else {
        // Create new without id
        const newId = `job-${Date.now()}`
        existingVacancies.push({
          ...vacancy,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        dataJson.VACANCIES = existingVacancies
        await writeData(dataPath, dataJson)
        await logAdminAction('CREATE', 'VACANCY', newId, { title: vacancy.title })
      }
    } else {
      return NextResponse.json({ success: false, error: 'No data provided' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: existingVacancies })
  } catch (err) {
    console.error('Failed to save careers data:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
