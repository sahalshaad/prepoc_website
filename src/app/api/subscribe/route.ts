import { NextRequest, NextResponse } from 'next/server'
import { newsletterService } from '@/services/newsletterService'
import { checkRateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const EmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const isAllowed = checkRateLimit(ip, 'subscribe', 5, 60 * 60 * 1000)

    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { email } = body

    const parseResult = EmailSchema.safeParse({ email })
    if (!parseResult.success) {
      return NextResponse.json({ success: false, errors: parseResult.error.issues }, { status: 400 })
    }

    await newsletterService.subscribeUser(email, 'footer')

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' })
  } catch (err: any) {
    if (err.message === 'Email is already subscribed.') {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 })
    }
    console.error('Failed to subscribe:', err)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
