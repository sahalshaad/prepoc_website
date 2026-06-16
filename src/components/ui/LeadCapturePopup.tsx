'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { X, CheckCircle, Loader2 } from 'lucide-react'

type PopupStatus = 'submitted' | 'dismissed'

interface PopupData {
  status: PopupStatus
  expiry?: number
}

const SERVICES = [
  'Web Development',
  'SEO Services',
  'Branding',
  'Digital Marketing',
  'Performance Marketing',
  'Social Media Marketing',
  'AI Solutions',
  'Business Automation',
  'Consultation',
  'Other',
]

export default function LeadCapturePopup() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceInterested: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    const checkPopupEligibility = () => {
      try {
        const stored = localStorage.getItem('leadPopupData')
        if (stored) {
          const data: PopupData = JSON.parse(stored)
          if (data.status === 'submitted') return false
          if (data.status === 'dismissed' && data.expiry && Date.now() < data.expiry) {
            return false
          }
        }
        return true
      } catch {
        return true
      }
    }

    if (checkPopupEligibility()) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 30000) // 30 seconds

      return () => clearTimeout(timer)
    }
  }, [hasMounted])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus trap basic implementation
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleClose = () => {
    if (isSubmitting || isSuccess) return

    setIsOpen(false)
    try {
      const data: PopupData = {
        status: 'dismissed',
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }
      localStorage.setItem('leadPopupData', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to access localStorage')
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.serviceInterested) newErrors.serviceInterested = 'Please select a service'
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: formData }),
      })

      if (!res.ok) throw new Error('Submission failed')

      setIsSuccess(true)
      try {
        const data: PopupData = { status: 'submitted' }
        localStorage.setItem('leadPopupData', JSON.stringify(data))
      } catch (e) {
        // ignore storage errors
      }

      setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasMounted) return null
  if (pathname?.startsWith('/admin')) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-[550px] relative z-10 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
          >
            {/* Header */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-neutral-100 relative">
              {!isSuccess && !isSubmitting && (
                <button
                  onClick={handleClose}
                  className="absolute right-6 top-6 sm:right-8 sm:top-8 text-neutral-400 hover:text-black transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <h2 id="popup-title" className="text-2xl sm:text-3xl font-outfit font-semibold text-black mb-2">
                Let&apos;s Build Something <span className="text-blue-500">Extraordinary</span>
              </h2>
              <p className="text-neutral-600 font-outfit text-sm sm:text-base leading-relaxed">
                Tell us about your project and our team will get back to you with strategic recommendations tailored to your business goals.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 bg-neutral-50">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-outfit font-semibold text-black mb-2">
                    Thank you!
                  </h3>
                  <p className="text-neutral-600 font-outfit">
                    We&apos;ve received your inquiry and will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="popup-name" className="text-sm font-medium text-neutral-700">Full Name</label>
                      <input
                        id="popup-name"
                        type="text"
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-blue-500 focus:border-blue-500'} bg-white text-sm outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="popup-email" className="text-sm font-medium text-neutral-700">Email Address</label>
                      <input
                        id="popup-email"
                        type="email"
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-blue-500 focus:border-blue-500'} bg-white text-sm outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="popup-company" className="text-sm font-medium text-neutral-700">Company <span className="text-neutral-400 font-normal">(Optional)</span></label>
                      <input
                        id="popup-company"
                        type="text"
                        disabled={isSubmitting}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-20 transition-all"
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="popup-service" className="text-sm font-medium text-neutral-700">Service Interested</label>
                      <select
                        id="popup-service"
                        disabled={isSubmitting}
                        value={formData.serviceInterested}
                        onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.serviceInterested ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-blue-500 focus:border-blue-500'} bg-white text-sm outline-none focus:ring-2 focus:ring-opacity-20 transition-all appearance-none`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: `right 0.5rem center`,
                          backgroundRepeat: `no-repeat`,
                          backgroundSize: `1.5em 1.5em`,
                        }}
                      >
                        <option value="" disabled>Select a service</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.serviceInterested && <p className="text-xs text-red-500">{errors.serviceInterested}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="popup-message" className="text-sm font-medium text-neutral-700">Message</label>
                    <textarea
                      id="popup-message"
                      rows={3}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-blue-500 focus:border-blue-500'} bg-white text-sm outline-none focus:ring-2 focus:ring-opacity-20 transition-all resize-none`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white px-6 py-4 rounded-xl hover:bg-neutral-800 transition-colors font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
