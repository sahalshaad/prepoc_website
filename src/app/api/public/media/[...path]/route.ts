import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'storage', 'uploads')

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    if (!params.path || params.path.length === 0) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const filePathArray = params.path
    
    // Prevent directory traversal
    for (const segment of filePathArray) {
      if (segment === '..' || segment === '.' || segment.includes('/')) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    const absolutePath = path.join(UPLOADS_DIR, ...filePathArray)

    if (!existsSync(absolutePath)) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const fileBuffer = await fs.readFile(absolutePath)

    const ext = path.extname(absolutePath).toLowerCase()
    let contentType = 'application/octet-stream'

    if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.svg') contentType = 'image/svg+xml'
    else if (ext === '.avif') contentType = 'image/avif'
    else if (ext === '.mp4') contentType = 'video/mp4'
    else if (ext === '.webm') contentType = 'video/webm'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Media Serving Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
