import { NextRequest, NextResponse } from 'next/server'
import { newsletterService } from '@/services/newsletterService'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return new NextResponse('Missing email parameter.', { status: 400 })
    }

    await newsletterService.unsubscribeUser(email)

    // A simple HTML response for the user
    return new NextResponse(`
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; background: #f9fafb; color: #111827; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            h1 { font-size: 24px; margin-bottom: 16px; }
            p { color: #4B5563; line-height: 1.5; }
            a { display: inline-block; margin-top: 24px; color: #2563EB; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Successfully Unsubscribed</h1>
            <p>You have been removed from our mailing list. We're sorry to see you go!</p>
            <p>If this was a mistake, you can always resubscribe on our website.</p>
            <a href="/">Return to Homepage</a>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    })

  } catch (err: any) {
    if (err.message === 'Subscriber not found.') {
      return new NextResponse('Subscriber not found.', { status: 404 })
    }
    console.error('Failed to unsubscribe:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
