import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { erpApi } from '@/lib/erp-api'
import { MapPin, Briefcase, Clock, CalendarDays } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const res = await erpApi.getJob(slug)

  if (!res.success || !res.data) {
    return { title: 'Job Not Found - PREPOC Careers' }
  }

  const job = res.data
  return {
    title: `${job.title} - PREPOC Careers`,
    description: job.meta_description || job.description.substring(0, 160),
    keywords: job.keywords || '',
    openGraph: {
      title: `${job.title} - PREPOC Careers`,
      description: job.meta_description || job.description.substring(0, 160),
      url: job.canonical_url || `https://prepoc.in/careers/${slug}`
    }
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = params
  const res = await erpApi.getJob(slug)

  if (!res.success || !res.data) {
    notFound()
  }

  const job = res.data

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container-wide max-w-4xl mx-auto px-4 md:px-0">
        
        <Link href="/careers" className="text-sm font-medium text-primary hover:underline mb-8 inline-block">
          &larr; Back to all open roles
        </Link>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-10 border-b border-white/10 pb-10">
            <span className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> {job.department_name}</span>
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</span>
            <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {job.employment_type}</span>
          </div>
          
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-heading prose-headings:font-semibold">
            <h3>About the Role</h3>
            <p className="whitespace-pre-wrap text-zinc-300">{job.description}</p>
            
            <h3 className="mt-8">Requirements</h3>
            <div className="whitespace-pre-wrap text-zinc-300 ml-4">
              {job.requirements.split('\n').map((req: string, i: number) => (
                <li key={i}>{req}</li>
              ))}
            </div>
            
            {job.experience_min !== null && job.experience_max !== null && (
              <>
                <h3 className="mt-8">Experience</h3>
                <p className="text-zinc-300">{job.experience_min} - {job.experience_max} years</p>
              </>
            )}
          </div>
          
          <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <p className="text-zinc-400 text-sm">
              Think you&apos;re a great fit? We&apos;d love to hear from you.
            </p>
            {/* Navigates back to /careers because applying is currently handled via modal on /careers page */}
            {/* In the future we can move the apply modal here or open it via URL param */}
            <Link href={`/careers?apply=${slug}`} className="btn-primary px-10 py-3 text-center w-full sm:w-auto">
              Apply for this position
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  )
}
