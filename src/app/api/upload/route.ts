import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import { saveMedia } from '@/lib/admin/mediaService'
import { checkRateLimit } from '@/lib/rateLimit'

// Ensure standard configuration
export const maxDuration = 60 // Allow up to 60s for video optimization

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const isAllowed = checkRateLimit(ip, 'upload', 10, 60 * 60 * 1000)
    
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Too many uploads. Please try again later.' }, { status: 429 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as string | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ success: false, error: 'No category provided.' }, { status: 400 })
    }

    const result = await saveMedia(file, category)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || 'Unsupported file type' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Upload API Error:', err)
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: 'Internal Server Error: ' + errorMsg }, { status: 500 })
  }
}
