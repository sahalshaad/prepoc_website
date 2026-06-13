import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readData, writeData } from '@/lib/dataStore'
import { LeadSchema } from '@/lib/schemas'
import { checkRateLimit } from '@/lib/rateLimit'
import { ContactLead } from '@/types/admin'

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const isAllowed = checkRateLimit(ip, 'leads', 5, 60 * 60 * 1000)
    
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { lead } = body

    if (!lead) {
      return NextResponse.json({ success: false, error: 'No data provided' }, { status: 400 })
    }

    const parseResult = LeadSchema.safeParse(lead)
    if (!parseResult.success) {
      return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'leadsData.json')
    const dataJson = await readData(dataPath, { LEADS: [] })
    const existingLeads = (dataJson.LEADS || []) as ContactLead[]

    const newLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'new',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    existingLeads.push(newLead)
    dataJson.LEADS = existingLeads

    await writeData(dataPath, dataJson)
    
    return NextResponse.json({ success: true, data: { id: newLead.id } })
  } catch (err) {
    console.error('Failed to submit lead:', err)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
