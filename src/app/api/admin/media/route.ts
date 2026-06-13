import { NextRequest, NextResponse } from 'next/server'
import { listMedia, deleteMedia } from '@/lib/admin/mediaService'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const media = await listMedia(category)
    return NextResponse.json({ success: true, data: media })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ success: false, error: 'No URL provided' }, { status: 400 })
    }

    const deleted = await deleteMedia(url)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'File not found or failed to delete' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 })
  }
}
