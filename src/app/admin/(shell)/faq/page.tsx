import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatCard } from '@/components/admin/ui/StatCard'
import { HelpCircle, Eye, EyeOff } from 'lucide-react'
import FaqClient from './FaqClient'

export const metadata: Metadata = {
  title: 'FAQ Management | Admin Dashboard',
}

const DEFAULT_FAQS = [
  {
    question: 'What services does PREPOC Technologies offer?',
    answer:
      'We offer a full spectrum of digital services including Web Development, Mobile App Development, Digital Marketing, SEO, Brand Identity, AI Solutions, and Business Automation. Whether you need a stunning website, a high-performance mobile app, or a complete digital growth strategy, we have you covered.',
    order: 0,
  },
  {
    question: 'How long does it take to complete a project?',
    answer:
      'Project timelines vary depending on scope and complexity. A typical website takes 2–4 weeks, while a full-scale mobile application can take 6–12 weeks. We always share a detailed project roadmap at kickoff so you know exactly what to expect at every stage.',
    order: 1,
  },
  {
    question: 'Do you work with startups and small businesses?',
    answer:
      'Absolutely. We work with businesses of all sizes — from early-stage startups to established enterprises. We tailor our approach and packages to fit your budget and growth goals, ensuring you get maximum ROI regardless of company size.',
    order: 2,
  },
  {
    question: 'What is your development process like?',
    answer:
      'Our process follows a proven five-stage flow: Discovery & Strategy → Design & Prototyping → Development → Testing & QA → Launch & Growth. We keep you involved at every milestone with clear communication, live previews, and regular progress reports.',
    order: 3,
  },
  {
    question: 'Will I own the source code and assets after the project?',
    answer:
      'Yes, 100%. Once the project is delivered and payment is complete, all source code, design files, and digital assets are fully yours. We believe in transparent, client-first ownership — no lock-in, no hidden clauses.',
    order: 4,
  },
  {
    question: 'Do you offer post-launch support and maintenance?',
    answer:
      'Yes. We offer flexible ongoing support and maintenance plans that cover security updates, performance monitoring, feature additions, and technical troubleshooting. Think of us as your long-term digital partner, not just a one-time vendor.',
    order: 5,
  },
  {
    question: 'How do I get started with PREPOC?',
    answer:
      "Simply reach out via email at info@prepoc.in or call us at +91 9072595415 to book a free consultation. We'll understand your goals, share our approach, and provide a detailed proposal — no commitment required.",
    order: 6,
  },
]

export default async function FaqPage() {
  // Seed defaults if the table is empty
  const count = await prisma.faq.count()
  if (count === 0) {
    await prisma.faq.createMany({ data: DEFAULT_FAQS })
  }

  const [faqs, totalFaqs, activeFaqs] = await Promise.all([
    prisma.faq.findMany({ orderBy: { order: 'asc' } }),
    prisma.faq.count(),
    prisma.faq.count({ where: { isActive: true } }),
  ])

  return (
    <div className="p-6 max-w-[900px]">
      <PageHeader
        title="FAQ Management"
        description="Add, edit, reorder, and toggle visibility of FAQ items shown on the homepage."
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total FAQs"
          value={totalFaqs}
          icon={<HelpCircle size={16} />}
          accentColor="#D4AF37"
        />
        <StatCard
          label="Visible on Site"
          value={activeFaqs}
          icon={<Eye size={16} />}
          accentColor="#4ade80"
        />
        <StatCard
          label="Hidden"
          value={totalFaqs - activeFaqs}
          icon={<EyeOff size={16} />}
          accentColor="#71717a"
        />
      </div>

      <FaqClient initialFaqs={faqs} />
    </div>
  )
}
