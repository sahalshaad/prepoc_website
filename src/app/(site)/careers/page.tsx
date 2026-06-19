'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, Clock, ChevronDown, CheckCircle2, Upload, Loader2, X, FileText, Eye } from 'lucide-react'
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

  // Resume file state
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Refs
  const formScrollRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadVacancies() {
      try {
        const res = await fetch('/api/careers', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          setVacancies(data.data as JobVacancy[])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadVacancies()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (applyingTo) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [applyingTo])

  // Clean up preview URL on modal close
  useEffect(() => {
    if (!applyingTo) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setResumeFile(null)
      setShowPreview(false)
    }
  }, [applyingTo]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setResumeFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (file) {
      // blob URL for download fallback
      setPreviewUrl(URL.createObjectURL(file))
      // base64 data URL for in-modal preview (works cross-browser, no security restrictions)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviewDataUrl(ev.target?.result as string ?? null)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
      setPreviewDataUrl(null)
    }
  }, [previewUrl])

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResumeFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPreviewDataUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!resumeFile || !previewUrl) return
    const isPdf = resumeFile.type === 'application/pdf' || resumeFile.name.endsWith('.pdf')
    if (isPdf) {
      setShowPreview(true)
    } else {
      // For DOC/DOCX open in new tab (browser will download)
      const a = document.createElement('a')
      a.href = previewUrl
      a.download = resumeFile.name
      a.click()
    }
  }

  // Intercept wheel events on the overlay: only allow scrolling if it originates inside the form
  const handleOverlayWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const form = formScrollRef.current
    if (!form) return
    if (form.contains(e.target as Node)) {
      e.stopPropagation()
    } else {
      e.preventDefault()
    }
  }

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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md"
            onWheel={handleOverlayWheel}
            onClick={(e) => { if (e.target === e.currentTarget) setApplyingTo(null) }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#09090b] border border-white/10 shadow-2xl rounded-2xl w-full max-w-2xl flex flex-col relative"
              style={{ maxHeight: '90vh' }}
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-50 rounded-t-2xl pointer-events-none" />

              {/* Header */}
              <div className="px-6 py-5 md:px-8 md:py-6 border-b border-white/5 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-white tracking-tight">Apply for {applyingTo.title}</h2>
                  <p className="text-sm text-zinc-400 mt-1.5 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {applyingTo.department}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {applyingTo.location}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setApplyingTo(null)} 
                  className="p-2 -mr-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              {submitStatus === 'success' ? (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-5"
                  >
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-heading font-semibold text-white tracking-tight">Application Submitted!</h3>
                    <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      Thank you for applying. Our team will review your profile and reach out if you&apos;re a great fit.
                    </p>
                    <button onClick={() => setApplyingTo(null)} className="btn-primary mt-8 px-8">
                      Done
                    </button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Scrollable Form */}
                  <form
                    id="application-form"
                    ref={formScrollRef}
                    onSubmit={handleSubmit}
                    className="p-6 md:p-8 space-y-6"
                    style={{
                      flex: '1 1 0%',
                      minHeight: 0,
                      overflowY: 'auto',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-3">
                        <X className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name *</label>
                        <input required name="name" type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600" placeholder="John Doe" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address *</label>
                        <input required name="email" type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number *</label>
                        <input required name="phone" type="tel" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Location *</label>
                        <input required name="location" type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600" placeholder="City, Country" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">LinkedIn URL *</label>
                        <input required name="linkedinUrl" type="url" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600" placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Portfolio URL</label>
                        <input name="portfolioUrl" type="url" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600" placeholder="https://..." />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Resume / CV *</label>
                      {resumeFile ? (
                        /* File attached — show name + actions */
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3"
                        >
                          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{resumeFile.name}</p>
                            <p className="text-xs text-zinc-500">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={handlePreviewClick}
                              title={resumeFile.name.endsWith('.pdf') ? 'Preview PDF' : 'Download to preview'}
                              className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              title="Remove file"
                              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Hidden real input to satisfy form required */}
                          <input
                            ref={fileInputRef}
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="sr-only"
                            aria-hidden="true"
                          />
                        </motion.div>
                      ) : (
                        /* Empty drop-zone */
                        <div className="relative group">
                          <input
                            ref={fileInputRef}
                            required
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-full bg-white/[0.02] group-hover:bg-white/[0.04] border border-white/10 group-hover:border-primary/50 border-dashed rounded-xl px-4 py-8 text-center flex flex-col items-center justify-center transition-all">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-zinc-300" />
                            </div>
                            <p className="text-sm font-medium text-white">Click or drag file to upload</p>
                            <p className="text-xs text-zinc-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cover Letter *</label>
                      <textarea required name="coverLetter" rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-white placeholder-zinc-600 resize-y" placeholder="Tell us why you're a great fit for this role..." />
                    </div>
                  </form>

                  {/* Fixed Footer */}
                  <div className="px-6 py-5 md:px-8 border-t border-white/5 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={() => setApplyingTo(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all">
                      Cancel
                    </button>
                    <button type="submit" form="application-form" disabled={submitStatus === 'submitting'} className="btn-primary min-w-[160px] flex justify-center items-center rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                      {submitStatus === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPreview && previewUrl && resumeFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full max-w-2xl"
              style={{ height: '75vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{resumeFile.name}</p>
                    <p className="text-xs text-zinc-500">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 ml-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* PDF Viewer — uses base64 data URL for cross-browser compatibility */}
              <div className="flex-1 min-h-0 bg-zinc-900 rounded-b-2xl overflow-hidden">
                {previewDataUrl ? (
                  <iframe
                    src={previewDataUrl}
                    className="w-full h-full border-0"
                    title={`Preview: ${resumeFile.name}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading preview...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
