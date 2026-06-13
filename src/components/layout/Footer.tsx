'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { isSafeUrl } from '@/utils/urlValidation'

const footerLinks = {
  Services: [
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
  ],
  Company: [
    'About Us',
    'Our Team',
    'Case Studies',
    'Blog',
    'Careers',
    'Press',
  ],
  Resources: [
    'Free Audit',
    'Marketing Checklist',
    'SEO Guide',
    'Brand Kit',
    'Privacy Policy',
    'Terms of Service',
  ],
}

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050505 0%, #030303 100%)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
      role="contentinfo"
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(14, 93, 71, 0.5) 30%, rgba(212, 175, 55, 0.5) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide py-10 md:py-14 lg:py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 mb-10 md:mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-3 mb-6 group"
              aria-label="PREPOC Technologies - Back to top"
            >
              <Image 
                src="/logo/prepoc-logo.png" 
                alt="PREPOC Technologies" 
                width={300} 
                height={80} 
                className="h-10 md:h-14 lg:h-20 w-auto"
              />
            </button>

            <p className="text-muted font-body leading-relaxed mb-8 max-w-xs" style={{ fontSize: '0.875rem' }}>
              Transforming businesses through premium digital solutions. Strategy, creativity, and technology — united for exceptional results.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3" aria-label="Social media links">
              {socialLinks.map((social) => (
                isSafeUrl(social.href) && (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-heading font-semibold text-foreground text-sm mb-5 tracking-wide">
                  {category}
                </h3>
                <ul className="space-y-3" aria-label={`${category} links`}>
                  {links.map((link) => (
                    <li key={link}>
                      {link === 'Careers' ? (
                        <Link href="/careers" className="footer-link">
                          {link}
                        </Link>
                      ) : (
                        <a href="#" className="footer-link">
                          {link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-1">
              Stay ahead of the curve
            </h4>
            <p className="text-muted text-sm">
              Digital insights, growth tactics, and industry news — weekly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
              aria-label="Email address for newsletter"
            />
            <button
              className="btn-primary text-sm py-3 px-5 flex-shrink-0 w-full sm:w-auto"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-muted text-xs text-center sm:text-left">
            © {currentYear} PREPOC Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="footer-link text-xs">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
