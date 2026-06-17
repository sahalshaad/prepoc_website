import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readData, writeData } from '@/lib/dataStore'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { JobApplication } from '@/types/admin'

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'jobApplicationsData.json')

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const dataJson = await readData(DATA_PATH, { APPLICATIONS: [] })
    return NextResponse.json({ success: true, data: dataJson.APPLICATIONS || [] })
  } catch (err) {
    console.error('Failed to load applications data:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { application, action, id } = body

    const dataJson = await readData(DATA_PATH, { APPLICATIONS: [] })
    let existingApplications = (dataJson.APPLICATIONS || []) as JobApplication[]

    if (action === 'delete' && id) {
      existingApplications = existingApplications.filter(a => a.id !== id)
      dataJson.APPLICATIONS = existingApplications
      await writeData(DATA_PATH, dataJson)
      await logAdminAction('DELETE', 'JOB_APPLICATION', id)
      return NextResponse.json({ success: true, data: existingApplications })
    }

    if (application && application.id) {
      const index = existingApplications.findIndex(a => a.id === application.id)
      if (index > -1) {
        existingApplications[index] = {
          ...existingApplications[index],
          ...application,
          updatedAt: new Date().toISOString()
        }
        dataJson.APPLICATIONS = existingApplications
        await writeData(DATA_PATH, dataJson)
        await logAdminAction('UPDATE', 'JOB_APPLICATION', application.id, { status: application.status })
      } else {
        existingApplications.push({
          ...application,
          updatedAt: new Date().toISOString()
        })
        dataJson.APPLICATIONS = existingApplications
        await writeData(DATA_PATH, dataJson)
        await logAdminAction('CREATE', 'JOB_APPLICATION', application.id)
      }
    } else {
      return NextResponse.json({ success: false, error: 'No data provided' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: existingApplications })
  } catch (err) {
    console.error('Failed to save applications data:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
