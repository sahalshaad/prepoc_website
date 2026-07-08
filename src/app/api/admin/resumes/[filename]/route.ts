import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  // 1. Ensure the user is an authenticated Admin
  try { 
    await requireAdmin(); 
  } catch (e) { 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
  }

  const { filename } = params
  
  // 2. Prevent directory traversal attacks
  const safeFilename = path.basename(filename)
  if (safeFilename !== filename) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'storage', 'resumes', safeFilename)

  try {
    // 3. Check if file exists and read it
    const fileBuffer = await fs.readFile(filePath)
    
    // Determine content type
    const ext = path.extname(safeFilename).toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === '.pdf') contentType = 'application/pdf'
    else if (ext === '.doc') contentType = 'application/msword'
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    // 4. Return the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${safeFilename}"`, // inline allows previewing PDFs in browser
      },
    })
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return NextResponse.json({ error: 'Resume file not found' }, { status: 404 })
    }
    console.error('Error serving resume:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
