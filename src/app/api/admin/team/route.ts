import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { z } from 'zod'
import { readData, writeData } from '@/lib/dataStore'
import { TeamMemberSchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { TeamMember } from '@/data/aboutData'

const BulkTeamMemberSchema = z.array(TeamMemberSchema)

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { member, members } = body

    const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const aboutJson = await readData(aboutPath, { TEAM_MEMBERS: [] })

    if (members) {
      // Validate bulk
      const parseResult = BulkTeamMemberSchema.safeParse(members)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      const originalMembers = (aboutJson.TEAM_MEMBERS || []) as TeamMember[]
      const originalFounder = originalMembers.find((m) => m.isFounder)
      
      if (originalFounder) {
        const hasFounder = (members as TeamMember[]).some((m) => m.isFounder || m.id === originalFounder.id)
        if (!hasFounder) {
          return NextResponse.json({ success: false, error: 'Cannot delete the Founder.' }, { status: 400 })
        }
      }
      aboutJson.TEAM_MEMBERS = members
      
      await writeData(aboutPath, aboutJson)
      await logAdminAction('BULK_UPDATE', 'TEAM', 'all')
      
    } else if (member) {
      // Validate single
      const parseResult = TeamMemberSchema.safeParse(member)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      const existingMembers = (aboutJson.TEAM_MEMBERS || []) as TeamMember[]
      
      if (member.id) {
        // Update
        const memberId = Number(member.id)
        const index = existingMembers.findIndex((m: TeamMember) => m.id === memberId)
        if (index > -1) {
          const original = existingMembers[index]
          existingMembers[index] = {
            id: memberId,
            name: member.name,
            title: member.title,
            department: member.department,
            bio: member.bio,
            image: member.image,
            linkedin: member.linkedin,
            isFounder: original.isFounder || member.isFounder || false,
            isLeadership: typeof member.isLeadership === 'boolean' ? member.isLeadership : original.isLeadership,
            isActive: typeof member.isActive === 'boolean' ? member.isActive : original.isActive,
            message: original.message,
            messageExtended: original.messageExtended,
            credentials: original.credentials
          }
          await writeData(aboutPath, aboutJson)
          await logAdminAction('UPDATE', 'TEAM', String(memberId), { name: member.name })
        } else {
          return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 })
        }
      } else {
        // Insert
        const nextId = existingMembers.reduce((max: number, m: TeamMember) => Math.max(max, m.id), 0) + 1
        const newMember = {
          id: nextId,
          name: member.name,
          title: member.title,
          department: member.department,
          bio: member.bio,
          image: member.image,
          linkedin: member.linkedin,
          isFounder: false,
          isLeadership: typeof member.isLeadership === 'boolean' ? member.isLeadership : false,
          isActive: typeof member.isActive === 'boolean' ? member.isActive : true
        }
        existingMembers.push(newMember)
        await writeData(aboutPath, aboutJson)
        await logAdminAction('CREATE', 'TEAM', String(nextId), { name: member.name })
      }
    } else {
      return NextResponse.json({ success: false, error: 'No data provided' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: aboutJson.TEAM_MEMBERS })
  } catch (err) {
    console.error('Failed to save team member(s):', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const aboutJson = await readData(aboutPath, { TEAM_MEMBERS: [] })
    return NextResponse.json({ success: true, data: aboutJson.TEAM_MEMBERS || [] })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
