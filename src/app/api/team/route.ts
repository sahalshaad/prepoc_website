import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { TeamMember } from '@/types/admin'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    const dataJson = JSON.parse(fileContent)
    
    // Filter to only include active members
    const allMembers = (dataJson.TEAM_MEMBERS || []) as TeamMember[]
    const activeMembers = allMembers.filter((m) => m.isActive)
    
    // Select specific fields safe for public exposure
    const publicData = activeMembers.map((m) => ({
      id: m.id,
      name: m.name,
      title: m.title,
      department: m.department,
      bio: m.bio,
      linkedin: m.linkedin,
      image: m.image,
      isLeadership: m.isLeadership,
      isFounder: m.isFounder,
      message: m.message,
      messageExtended: m.messageExtended,
      credentials: m.credentials,
      displayOrder: m.displayOrder
    }))

    return NextResponse.json({ success: true, data: publicData })
  } catch (err) {
    console.error('Failed to load team data:', err)
    return NextResponse.json({ success: false, error: 'Failed to load team data' }, { status: 500 })
  }
}
