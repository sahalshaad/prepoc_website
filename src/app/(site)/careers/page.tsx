'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, Clock, ChevronDown, CheckCircle2, Upload, Loader2 } from 'lucide-react'
import { JobVacancy } from '@/types/admin'

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000 / 60
  if (diff < 60) return `${Math.floor(diff)}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`
  return `${Math.floor(diff / 10080)}w ago`
}

export default function CareersPage() {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Application State
  const [applyingTo, setApplyingTo] = useState<JobVacancy | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function loadVacancies() {
      try {
        const res = await fetch('/api/careers', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          const active = (data.data as JobVacancy[]).filter(v => v.isActive)
          setVacancies(active)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadVacancies()
  }, [])

  const handleApplyClick = (vacancy: JobVacancy, e: React.MouseEvent) => {
    e.stopPropagation()
    setApplyingTo(vacancy)
    setSubmitStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!applyingTo) return
    setSubmitStatus('submitting')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    formData.append('jobId', applyingTo.id)
    formData.append('jobTitle', applyingTo.title)

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application')
      }
      setSubmitStatus('success')
    } catch (err) {
      console.error(err)
      setSubmitStatus('error')
      setErrorMsg(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container-wide relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-6">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium tracking-wide bg-primary/10 text-primary border border-primary/20">
              Join Our Team
            </span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Future</span> with PREPOC
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-muted md:text-xl font-body">
            Join a team of innovators, strategists, designers, and developers shaping digital experiences that drive growth.
          </motion.p>
        </div>
      </section>

      {/* Vacancies Section */}
      <section className="py-20 relative">
        <div className="container-wide max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-muted flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading open positions...</p>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-xl font-heading font-semibold mb-2">No open positions</h3>
              <p className="text-muted">We don&apos;t have any open roles right now, but we&apos;re always looking for great talent. Check back later!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vacancies.map((vacancy) => (
                <div key={vacancy.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-primary/50">
                  <div 
                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    onClick={() => setExpandedId(expandedId === vacancy.id ? null : vacancy.id)}
                  >
                    <div>
                      <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3">{vacancy.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {vacancy.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {vacancy.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {vacancy.type}</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-md">Posted {timeAgo(vacancy.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <button 
                        onClick={(e) => handleApplyClick(vacancy, e)}
                        className="btn-primary text-sm px-6 py-2.5"
                      >
                        Apply Now
                      </button>
                      <ChevronDown className={`w-5 h-5 text-muted transition-transform ${expandedId === vacancy.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === vacancy.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-6 md:p-8 space-y-8 bg-black/20 text-sm md:text-base leading-relaxed text-zinc-300">
                          <div>
                            <h4 className="text-white font-semibold mb-3 font-heading text-lg">About the Role</h4>
                            <p className="whitespace-pre-wrap">{vacancy.description}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-3 font-heading text-lg">Requirements</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              {vacancy.requirements.split('\n').filter(Boolean).map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-3 font-heading text-lg">Responsibilities</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              {vacancy.responsibilities.split('\n').filter(Boolean).map((res, i) => <li key={i}>{res}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-3 font-heading text-lg">Benefits</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              {vacancy.benefits.split('\n').filter(Boolean).map((ben, i) => <li key={i}>{ben}</li>)}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {applyingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-950 z-10">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold">Apply for {applyingTo.title}</h2>
                  <p className="text-sm text-muted mt-1">{applyingTo.department} · {applyingTo.location}</p>
                </div>
                <button onClick={() => setApplyingTo(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  ✕
                </button>
              </div>

              <div className="p-6 md:p-8">
                {submitStatus === 'success' ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-heading font-semibold text-white">Application Submitted!</h3>
                    <p className="text-muted max-w-md mx-auto">
                      Thank you for applying. Our team will review your application and contact you if your profile matches our requirements.
                    </p>
                    <button onClick={() => setApplyingTo(null)} className="btn-primary mt-6">
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                        {errorMsg}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Full Name *</label>
                        <input required name="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email Address *</label>
                        <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Phone Number *</label>
                        <input required name="phone" type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Current Location *</label>
                        <input required name="location" type="text" placeholder="City, Country" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">LinkedIn URL *</label>
                        <input required name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Portfolio URL (Optional)</label>
                        <input name="portfolioUrl" type="url" placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Resume / CV (PDF, DOC, DOCX) *</label>
                      <div className="relative">
                        <input required name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full bg-white/5 border border-white/10 border-dashed rounded-lg px-4 py-6 text-center flex flex-col items-center justify-center pointer-events-none">
                          <Upload className="w-6 h-6 text-muted mb-2" />
                          <p className="text-sm text-zinc-300">Click or drag file to upload</p>
                          <p className="text-xs text-muted mt-1">Max 10MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Cover Letter *</label>
                      <textarea required name="coverLetter" rows={5} placeholder="Tell us why you're a great fit for this role..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white resize-y" />
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                      <button type="button" onClick={() => setApplyingTo(null)} className="px-6 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors">
                        Cancel
                      </button>
                      <button type="submit" disabled={submitStatus === 'submitting'} className="btn-primary min-w-[140px] flex justify-center">
                        {submitStatus === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
