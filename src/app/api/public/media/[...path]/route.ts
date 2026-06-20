// Use `node:` prefix so Turbopack can statically identify these as
// Node.js built-ins and correctly scope the NFT (Node File Trace).
import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

// Hoist UPLOADS_DIR as a module-level constant so Turbopack's static
// analyser can trace the `storage/uploads` directory at build time
// rather than emitting an NFT warning about an unresolvable dynamic path.
const UPLOADS_BASE = process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'storage', 'uploads')

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // In Next.js 16 dynamic route params are async — await before use.
    const { path: filePathArray } = await params

    if (!filePathArray || filePathArray.length === 0) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Prevent directory traversal
    for (const segment of filePathArray) {
      if (segment === '..' || segment === '.' || segment.includes('/')) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    const absolutePath = path.join(UPLOADS_BASE, ...filePathArray)

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
