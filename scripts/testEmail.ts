import nodemailer from 'nodemailer'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function sendTestEmail() {
  console.log('--- Nodemailer SMTP Test ---')

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const fromEmail = process.env.SMTP_FROM_EMAIL || user

  if (!host || !user || !pass) {
    console.error('[TEST_FATAL] SMTP credentials are not fully defined in .env.local')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })

  // We'll send it to the same email address that is sending it for testing purposes
  const toEmail = user

  console.log(`[TEST_INFO] Sending test email from ${fromEmail} to ${toEmail}`)

  try {
    const info = await transporter.sendMail({
      from: `"PREPOC Test" <${fromEmail}>`,
      to: toEmail,
      subject: 'PREPOC - Nodemailer SMTP Test',
      html: `
        <h2>Nodemailer SMTP Test Successful</h2>
        <p>This is a standalone test email verifying that your local environment variables and Gmail SMTP configuration are fully functional.</p>
        <p>If you received this, the Nodemailer integration is working perfectly.</p>
      `
    })

    console.log('[SMTP_SUCCESS]', info.messageId)
    console.log('Test completed successfully.')
  } catch (error) {
    console.error('[SMTP_ERROR]', error)
    process.exit(1)
  }
}

sendTestEmail().catch(console.error)
