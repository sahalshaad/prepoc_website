'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'

const navItems = [
  { label: 'Services', href: '#services', isLink: false, homeHref: '/#services', hasDropdown: true },
  { label: 'Portfolio', href: '#portfolio', isLink: false, homeHref: '/#portfolio', hasDropdown: false },
  { label: 'About Us', href: '/about', isLink: true, homeHref: '/about', hasDropdown: false },
  { label: 'Blog', href: '/blog', isLink: true, homeHref: '/blog', hasDropdown: false },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(homeHref)
    }
  }

  // Megamenu state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white',
          scrolled ? 'shadow-sm py-1.5' : 'py-2'
        )}
        onMouseLeave={() => setActiveDropdown(null)}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-wide relative">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="PREPOC Technologies - Home"
            >
              <svg 
                viewBox="0 0 170 50" 
                className="h-8 md:h-10 lg:h-12 w-auto" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <text x="0" y="38" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="42" fill="#111" letterSpacing="-0.04em">
                  PRE<tspan fill="#dc2626">.</tspan>POC
                </text>
              </svg>
            </Link>

            {/* Desktop Nav - Centered */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 h-full" aria-label="Site sections">
              {navItems.map((item) => {
                const isHovered = activeDropdown === item.label

                const content = (
                  <span 
                    className={cn(
                      "flex items-center gap-1.5 py-2",
                      isHovered ? "text-[#0E5D47]" : ""
                    )}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isHovered ? "rotate-180" : "opacity-60")} />
                    )}
                  </span>
                )

                const className = "text-[#111] font-medium text-sm hover:text-[#0E5D47] transition-colors relative"

                return (
                  <div 
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                  >
                    {item.isLink ? (
                      <Link href={item.href} className={className}>
                        {content}
                      </Link>
                    ) : (
                      <button onClick={() => handleNavClick(item.href, item.homeHref)} className={className}>
                        {content}
                      </button>
                    )}

                    {/* Megamenu Dropdown */}
                    {item.hasDropdown && (
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                            exit={{ opacity: 0, y: 10, scale: 0.98, x: "-50%", transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-full left-1/2 pt-6 w-[600px] cursor-default"
                          >
                            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex gap-6 relative before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-transparent">
                              {/* Layout based on reference HTML structure */}
                              {item.label === 'Services' && (
                                <>
                                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                                    {[
                                      'Digital Marketing',
                                      'Performance Marketing',
                                      'SEO',
                                      'Branding',
                                      'Graphic Design',
                                      'Video Production',
                                      'Web Development',
                                      'Mobile Apps',
                                      'AI Solutions',
                                      'Business Automation',
                                    ].map((service) => (
                                      <button 
                                        key={service} 
                                        onClick={() => handleNavClick('#services', '/#services')}
                                        className="text-left text-sm font-medium text-[#111] hover:text-[#0E5D47] hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                      >
                                        {service}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="w-px bg-gray-100" />
                                  <div className="w-48 grid gap-1 h-fit">
                                    <h5 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2 px-3">Explore</h5>
                                    {[
                                      { label: 'All Services', href: '#services', homeHref: '/#services' },
                                      { label: 'Our Process', href: '#process', homeHref: '/#process' },
                                      { label: 'Case Studies', href: '#portfolio', homeHref: '/#portfolio' },
                                      { label: 'FAQ', href: '#faq', homeHref: '/#faq' },
                                    ].map(link => (
                                      <button 
                                        key={link.label} 
                                        onClick={() => handleNavClick(link.href, link.homeHref)} 
                                        className="text-left text-sm text-gray-600 font-medium px-3 py-2 rounded-lg hover:text-[#0E5D47] hover:bg-gray-50 transition-colors"
                                      >
                                        {link.label}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Right side CTA */}
            <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
              <button
                onClick={() => handleNavClick('#contact', '/#contact')}
                className="text-[#111] font-medium text-sm hover:text-[#0E5D47] transition-colors underline-offset-4 hover:underline"
              >
                Contact Us
              </button>
              
              <motion.a
                href="https://wa.me/9072595415"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-[#0E5D47] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-[0_4px_14px_0_rgba(14,93,71,0.39)] hover:shadow-[0_6px_20px_rgba(14,93,71,0.23)] hover:bg-[#0c4e3b] transition-all"
              >
                <FaWhatsapp className="w-[18px] h-[18px]" />
                Chat with us
              </motion.a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-[#111]"
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
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col"
            aria-modal="true"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="container-wide pt-28 pb-12 flex-1 flex flex-col">
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
                        className="flex items-center justify-between py-5 border-b border-black/5 group w-full"
                      >
                        <span className="font-heading text-2xl font-semibold text-[#111]">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.href, item.homeHref)}
                        className="flex items-center justify-between py-5 border-b border-black/5 text-left group w-full"
                      >
                        <span className="font-heading text-2xl font-semibold text-[#111]">
                          {item.label}
                        </span>
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
                  className="bg-[#0E5D47] text-white w-full flex items-center justify-center gap-2 text-base py-4 rounded-full font-medium"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Chat with us
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
