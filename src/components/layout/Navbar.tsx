'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

const navItems = [
  { label: 'Home',     href: '/',         isLink: false, homeHref: '/'          },
  { label: 'Services', href: '#services', isLink: false, homeHref: '/#services' },
  { label: 'About',    href: '/about',    isLink: true,  homeHref: '/about'     },
  { label: 'Process',  href: '#process',  isLink: false, homeHref: '/#process'  },
  { label: 'Work',     href: '#portfolio',isLink: false, homeHref: '/#portfolio'},
  { label: 'Contact',  href: '#contact',  isLink: false, homeHref: '/#contact'  },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active section based on scroll and pathname
  useEffect(() => {
    if (pathname === '/about') {
      setActiveItem('About')
      return
    }

    if (pathname === '/') {
      const handleScroll = () => {
        const sections = navItems.filter(item => item.href.startsWith('#'))
        let current = 'Home'
        
        for (const section of [...sections].reverse()) {
          const el = document.getElementById(section.href.substring(1))
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= window.innerHeight / 3) {
              current = section.label
              break
            }
          }
        }
        
        if (window.scrollY < 100) {
          current = 'Home'
        }
        
        setActiveItem(current)
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // initial check
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = (href: string, homeHref: string) => {
    setMobileOpen(false)
    
    if (href === '/') {
      if (window.location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        router.push('/')
      }
      return
    }

    // If the anchor target exists on this page, smooth scroll to it.
    // Otherwise, navigate to the homepage section using client-side routing
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(homeHref)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass-dark border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-wide">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="PREPOC Technologies - Home"
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

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Site sections">
              {navItems.map((item) => {
                const isActive = activeItem === item.label
                
                const content = (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId={shouldReduceMotion ? undefined : "active-nav-indicator"}
                        initial={shouldReduceMotion ? { opacity: 0 } : false}
                        animate={shouldReduceMotion ? { opacity: 1 } : false}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 28,
                          mass: 1,
                          duration: shouldReduceMotion ? 0.3 : undefined
                        }}
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(18px)',
                          WebkitBackdropFilter: 'blur(18px)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: 'inset 1px 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0,0,0,0.05), 0 0 10px rgba(212, 175, 55, 0.04)',
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )

                const className = cn(
                  "relative px-4 py-2 font-body text-sm rounded-full transition-all duration-300 inline-block",
                  isActive ? "text-foreground font-medium" : "text-muted hover:text-foreground hover:-translate-y-[1px]"
                )

                return item.isLink ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={className}
                    onClick={() => setActiveItem(item.label)}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveItem(item.label)
                      handleNavClick(item.href, item.homeHref)
                    }}
                    className={className}
                  >
                    {content}
                  </button>
                )
              })}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/9072595415"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex btn-primary text-sm py-2.5 px-5"
              >
                Chat Now
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-foreground/70 hover:text-foreground transition-colors"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
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
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.07,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {item.isLink ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between py-5 border-b border-white/5 group w-full"
                      >
                        <span className="font-heading text-3xl font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                        <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.href, item.homeHref)}
                        className="flex items-center justify-between py-5 border-b border-white/5 text-left group w-full"
                      >
                        <span className="font-heading text-3xl font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                        <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="pt-8"
              >
                <a
                  href="https://wa.me/9072595415"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-base py-4 flex items-center"
                >
                  Chat Now
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
                <p className="text-center text-muted text-sm mt-4">
                  hello@prepoc.com · +1 (555) 000-0000
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
