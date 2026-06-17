import { Resend } from 'resend'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function sendTestEmail() {
  console.log('--- Resend API Test ---')

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.error('[TEST_FATAL] RESEND_API_KEY is not defined in .env.local')
    process.exit(1)
  }

  const resend = new Resend(resendKey)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  
  // Resend onboarding domains can ONLY send to the registered user's email address
  const toEmail = 'sahalshaad@gmail.com'

  console.log(`[TEST_INFO] Sending test email from ${fromEmail} to ${toEmail}`)

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'PREPOC - Resend API Test',
    html: `
      <h2>Resend API Test Successful</h2>
      <p>This is a standalone test email verifying that your local environment variables and Resend API configuration are fully functional.</p>
      <p>If you received this, the Resend integration is working perfectly.</p>
    `
  })

  if (error) {
    console.error('[RESEND_ERROR]', error)
    process.exit(1)
  }

  console.log('[RESEND_SUCCESS]', data)
  console.log('Test completed successfully.')
}

sendTestEmail().catch(console.error)
