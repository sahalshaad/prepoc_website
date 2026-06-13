import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { TeamMember } from '@/data/aboutData'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { founder, values } = body

    if (!founder || !values) {
      return NextResponse.json({ success: false, error: 'Missing required data fields' }, { status: 400 })
    }

    const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const aboutContent = await fs.readFile(aboutPath, 'utf-8')
    const aboutJson = JSON.parse(aboutContent)
    
    // 1. Update Core Values Data
    aboutJson.COMPANY_VALUES = values

    // 2. Find and sync Founder/CEO in Team list
    if (aboutJson.TEAM_MEMBERS) {
      const teamList = aboutJson.TEAM_MEMBERS as TeamMember[]
      let founderMember = teamList.find((m) => m.isFounder)
      
      // Fallback: match by ID 1 if no explicit isFounder flag is set yet
      if (!founderMember) {
        founderMember = teamList.find((m) => m.id === 1)
      }

      if (founderMember) {
        founderMember.name = founder.name
        founderMember.title = founder.position
        founderMember.image = founder.image
        founderMember.linkedin = founder.linkedin
        founderMember.isFounder = true
        founderMember.isLeadership = true
        founderMember.isActive = true
        founderMember.message = founder.message
        founderMember.messageExtended = founder.messageExtended
        founderMember.credentials = founder.credentials
      } else {
        // If not found at all, create a new Founder entry
        const nextId = teamList.reduce((max, m) => Math.max(max, m.id), 0) + 1
        const newFounder: TeamMember = {
          id: nextId,
          name: founder.name,
          title: founder.position,
          department: 'Leadership',
          bio: founder.bio || 'Founder & CEO of PREPOC Technologies.',
          image: founder.image,
          linkedin: founder.linkedin,
          isFounder: true,
          isLeadership: true,
          isActive: true,
          message: founder.message,
          messageExtended: founder.messageExtended,
          credentials: founder.credentials
        }
        teamList.unshift(newFounder) // Put founder at the beginning
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

export async function GET() {
  try {
    const aboutPath = path.join(process.cwd(), 'src', 'data', 'aboutData.json')
    const aboutContent = await fs.readFile(aboutPath, 'utf-8')
    const aboutJson = JSON.parse(aboutContent)

    const teamList = (aboutJson.TEAM_MEMBERS || []) as TeamMember[]
    let founderMember = teamList.find((m) => m.isFounder)
    
    // Fallback: match by ID 1
    if (!founderMember) {
      founderMember = teamList.find((m) => m.id === 1)
    }

    const founder = founderMember ? {
      name: founderMember.name,
      position: founderMember.title,
      message: founderMember.message || '',
      messageExtended: founderMember.messageExtended || '',
      image: founderMember.image,
      linkedin: founderMember.linkedin,
      credentials: founderMember.credentials || []
    } : null

    return NextResponse.json({
      success: true,
      data: {
        founder,
        values: aboutJson.COMPANY_VALUES || []
      }
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
