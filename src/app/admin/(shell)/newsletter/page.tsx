import { prisma } from '@/lib/prisma'
import NewsletterClient from './NewsletterClient'
import { Metadata } from 'next'
import { StatCard } from '@/components/admin/ui/StatCard'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Users, CheckCircle, UserMinus, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Newsletter Management | Admin Dashboard',
}

export default async function NewsletterPage() {
  const [
    totalSubscribers,
    activeSubscribers,
    unsubscribedSubscribers,
    campaigns,
    subscribers
  ] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: 'active' } }),
    prisma.subscriber.count({ where: { status: 'unsubscribed' } }),
    prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.subscriber.findMany({ orderBy: { subscribedAt: 'desc' } })
  ])

  const totalCampaignsSent = campaigns.filter(c => c.status === 'completed').length

  const metrics = {
    totalSubscribers,
    activeSubscribers,
    unsubscribedSubscribers,
    totalCampaignsSent
  }

  return (
    <div className="p-6 max-w-[1400px]">
      <PageHeader 
        title="Newsletter & Campaigns" 
        description="Manage your subscribers and send email campaigns." 
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Subscribers"
          value={metrics.totalSubscribers}
          icon={<Users size={16} />}
          accentColor="#a855f7"
        />
        <StatCard
          label="Active Subscribers"
          value={metrics.activeSubscribers}
          icon={<CheckCircle size={16} />}
          accentColor="#4ade80"
        />
        <StatCard
          label="Unsubscribed"
          value={metrics.unsubscribedSubscribers}
          icon={<UserMinus size={16} />}
          accentColor="#f87171"
        />
        <StatCard
          label="Campaigns Sent"
          value={metrics.totalCampaignsSent}
          icon={<Send size={16} />}
          accentColor="#60a5fa"
        />
      </div>

      <NewsletterClient initialSubscribers={subscribers} initialCampaigns={campaigns} />
    </div>
  )
}
