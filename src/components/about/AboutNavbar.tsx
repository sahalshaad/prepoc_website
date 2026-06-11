'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const sections = [
    { label: 'Our Story', id: 'story' },
    { label: 'Team', id: 'team' },
    { label: 'Values', id: 'values' },
    { label: 'Office', id: 'office' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass-dark border-b border-white/5 py-3' : 'bg-transparent py-5'
        )}
        role="navigation"
        aria-label="About page navigation"
      >
        <div className="container-wide">
          <div className="flex items-center justify-between">
            {/* Logo — links back to home */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Back to PREPOC home"
            >
              <Image
                src="/logo/prepoc-logo.png"
                alt="PREPOC Technologies"
                width={300}
                height={80}
                className="h-10 md:h-14 lg:h-20 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="About page sections">
              {sections.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.id)}
                  className="nav-link font-body text-sm"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden md:flex items-center gap-2 btn-outline text-sm py-2.5 px-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-foreground/70 hover:text-foreground transition-colors"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-bg flex flex-col"
            aria-modal="true"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="container-wide pt-24 pb-12 flex-1 flex flex-col">
              <nav className="flex flex-col gap-2 flex-1">
                {sections.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => scrollTo(item.id)}
                    className="flex items-center justify-between py-5 border-b border-white/5 text-left group"
                  >
                    <span className="font-heading text-3xl font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                    <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
                  </motion.button>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="pt-8"
              >
                <Link href="/" className="btn-primary w-full justify-center text-base py-4 flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
