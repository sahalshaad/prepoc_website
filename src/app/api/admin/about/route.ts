import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { TeamMember } from '@/data/aboutData'

// ─── Helper ──────────────────────────────────────────────────────────────────
function memberToFounder(m: TeamMember) {
  return {
    id: m.id,
    name: m.name,
    position: m.title,
    message: m.message || '',
    messageExtended: m.messageExtended || '',
    image: m.image,
    linkedin: m.linkedin,
    credentials: m.credentials || [],
    founderOrder: (m as any).founderOrder ?? 0,
  }
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const aboutContent = await fs.readFile(aboutPath, 'utf-8')
    const aboutJson = JSON.parse(aboutContent)

    const teamList = (aboutJson.TEAM_MEMBERS || []) as TeamMember[]

    // Collect all founders sorted by founderOrder
    let founders = teamList
      .filter((m) => m.isFounder)
      .sort((a, b) => ((a as any).founderOrder ?? 0) - ((b as any).founderOrder ?? 0))
      .map(memberToFounder)

    // Legacy fallback
    if (founders.length === 0) {
      const fallback = teamList.find((m) => m.id === 1)
      if (fallback) founders = [memberToFounder(fallback)]
    }

    return NextResponse.json({
      success: true,
      data: {
        founders,
        values: aboutJson.COMPANY_VALUES || [],
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { founders, values } = body

    if (!founders || !Array.isArray(founders) || !values) {
      return NextResponse.json({ success: false, error: 'Missing required data fields' }, { status: 400 })
    }

    const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const aboutContent = await fs.readFile(aboutPath, 'utf-8')
    const aboutJson = JSON.parse(aboutContent)

    // 1. Update Core Values
    aboutJson.COMPANY_VALUES = values

    // 2. Sync each founder back into TEAM_MEMBERS by id
    if (aboutJson.TEAM_MEMBERS) {
      const teamList = aboutJson.TEAM_MEMBERS as TeamMember[]

      for (const f of founders) {
        const existing = teamList.find((m) => m.id === f.id)
        if (existing) {
          existing.name = f.name
          existing.title = f.position
          existing.image = f.image
          existing.linkedin = f.linkedin
          existing.isFounder = true
          existing.isLeadership = true
          existing.isActive = true
          existing.message = f.message
          existing.messageExtended = f.messageExtended
          existing.credentials = f.credentials
          ;(existing as any).founderOrder = f.founderOrder
        }
        // Note: we don't auto-create here — use the Team page for new members
      }
    }

    await fs.writeFile(aboutPath, JSON.stringify(aboutJson, null, 2))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to save about details:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
