import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { z } from 'zod'
import { readData, writeData } from '@/lib/dataStore'
import { LeadSchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { ContactLead } from '@/types/admin'

const BulkLeadsSchema = z.array(LeadSchema.extend({ id: z.string(), submittedAt: z.string() }).passthrough())

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'leadsData.json')
    const dataJson = await readData(dataPath, { LEADS: [] })
    return NextResponse.json({ success: true, data: dataJson.LEADS || [] })
  } catch (err) {
    console.error('Failed to load leads data:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { lead, leads } = body

    const dataPath = path.join(process.cwd(), 'src', 'data', 'leadsData.json')
    const dataJson = await readData(dataPath, { LEADS: [] })
    let existingLeads = (dataJson.LEADS || []) as ContactLead[]

    if (leads) {
      // Validate bulk
      const parseResult = BulkLeadsSchema.safeParse(leads)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }
      existingLeads = leads
      dataJson.LEADS = existingLeads
      await writeData(dataPath, dataJson)
      await logAdminAction('BULK_UPDATE', 'LEADS', 'all')
    } else if (lead && lead.id) {
      // Validate single
      const parseResult = LeadSchema.safeParse(lead)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      const index = existingLeads.findIndex((l: ContactLead) => l.id === lead.id)
      if (index > -1) {
        existingLeads[index] = {
          ...existingLeads[index],
          ...lead,
          updatedAt: new Date().toISOString()
        }
        dataJson.LEADS = existingLeads
        await writeData(dataPath, dataJson)
        await logAdminAction('UPDATE', 'LEAD', lead.id, { status: lead.status })
      } else {
        return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 })
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid data provided' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: existingLeads })
  } catch (err) {
    console.error('Failed to save leads data:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
