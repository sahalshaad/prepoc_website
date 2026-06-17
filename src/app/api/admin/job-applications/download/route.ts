import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const fileParam = searchParams.get('file')

    if (!fileParam) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
    }

    // Prevent directory traversal
    const safeFilename = path.basename(fileParam)
    
    // Ensure only valid extensions
    const ext = safeFilename.split('.').pop()?.toLowerCase() || ''
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      return NextResponse.json({ error: 'Invalid file requested' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'storage', 'private', 'resumes', safeFilename)

    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = await fs.readFile(filePath)
    
    // Determine content type based on extension
    let contentType = 'application/octet-stream'
    if (ext === 'pdf') contentType = 'application/pdf'
    if (ext === 'doc') contentType = 'application/msword'
    if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized or internal error' }, { status: 401 })
  }
}
