import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'newsletter@prepoc.in'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://prepoc.in'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials are not fully configured')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })
}

export const newsletterService = {
  /**
   * Subscribe a new user or reactivate an unsubscribed one
   */
  async subscribeUser(email: string, source: string = 'footer') {
    const existing = await prisma.subscriber.findUnique({ where: { email } })

    if (existing) {
      if (existing.status === 'active') {
        throw new Error('Email is already subscribed.')
      } else {
        // Reactivate
        const updated = await prisma.subscriber.update({
          where: { email },
          data: { status: 'active', source },
        })
        await this.sendWelcomeEmail(email)
        return updated
      }
    }

    const newSubscriber = await prisma.subscriber.create({
      data: {
        email,
        status: 'active',
        source,
      },
    })

    await this.sendWelcomeEmail(email)
    return newSubscriber
  },

  /**
   * Unsubscribe a user
   */
  async unsubscribeUser(email: string) {
    const existing = await prisma.subscriber.findUnique({ where: { email } })
    if (!existing) {
      throw new Error('Subscriber not found.')
    }

    return prisma.subscriber.update({
      where: { email },
      data: { status: 'unsubscribed' },
    })
  },

  /**
   * Send the welcome email
   */
  async sendWelcomeEmail(email: string) {
    if (!process.env.SMTP_USER) return // Skip if no SMTP configured in dev

    const unsubscribeLink = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`

    try {
      const transporter = getTransporter()
      await transporter.sendMail({
        from: `"PREPOC Technologies" <${FROM_EMAIL}>`,
        to: email,
        subject: 'Welcome to PREPOC Technologies 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #000;">Welcome to PREPOC Technologies 🚀</h1>
            <p>Thank you for subscribing to our newsletter!</p>
            <p>We're thrilled to have you on board. You'll be the first to receive our latest updates, industry insights, and exclusive content about Web Development, Digital Marketing, and AI Solutions.</p>
            <br/>
            <p>Ready to build something extraordinary?</p>
            <a href="${SITE_URL}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Our Website</a>
            <br/><br/>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #666;">
              If you didn't mean to subscribe, you can <a href="${unsubscribeLink}" style="color: #666; text-decoration: underline;">unsubscribe here</a>.
            </p>
          </div>
        `,
      })
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      // We don't throw here to ensure the user is still subscribed even if email fails
    }
  },

  /**
   * Create a draft campaign
   */
  async createCampaign(data: { subject: string; content: string }) {
    return prisma.campaign.create({
      data: {
        subject: data.subject,
        content: data.content,
        status: 'draft',
      },
    })
  },

  /**
   * Batch send a campaign
   */
  async sendCampaign(campaignId: string) {
    if (!process.env.SMTP_USER) throw new Error('Missing SMTP Configuration')

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } })
    if (!campaign) throw new Error('Campaign not found.')
    if (campaign.status === 'completed') throw new Error('Campaign already sent.')

    // Update status to sending
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'sending' },
    })

    const subscribers = await prisma.subscriber.findMany({
      where: { status: 'active' },
      select: { email: true },
    })

    if (subscribers.length === 0) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'completed', recipientCount: 0, sentCount: 0, sentAt: new Date() },
      })
      return
    }

    // Update recipient count
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { recipientCount: subscribers.length },
    })

    const BATCH_SIZE = 50
    let totalSent = 0

    // Process in batches
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)
      
      const emailPayloads = batch.map((sub) => {
        const unsubscribeLink = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(sub.email)}`
        const finalContent = `
          ${campaign.content}
          <br/><br/>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">
            You are receiving this email because you subscribed on our website.<br/>
            PREPOC Technologies | <a href="${unsubscribeLink}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
          </p>
        `

        return {
          from: `"PREPOC Technologies" <${FROM_EMAIL}>`,
          to: sub.email,
          subject: campaign.subject,
          html: finalContent,
        }
      })

      try {
        const transporter = getTransporter()
        for (const payload of emailPayloads) {
          await transporter.sendMail(payload)
        }
        totalSent += batch.length
        
        // Update progress continuously
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { sentCount: totalSent },
        })
      } catch (err) {
        console.error('Batch failed', err)
        // Optionally handle partial failures by marking status = failed and breaking
      }
    }

    // Mark completed
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'completed', sentAt: new Date() },
    })
  },
}
