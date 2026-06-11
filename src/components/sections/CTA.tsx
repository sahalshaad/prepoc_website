'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'

export default function CTA() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:hello@prepoc.com'
  }

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      aria-label="Contact and call to action"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 100%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '800px',
            height: '500px',
            background:
              'radial-gradient(ellipse, rgba(14, 93, 71, 0.2) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA block */}
          <div className="glass rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 text-center mb-12 relative overflow-hidden">
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(14, 93, 71, 0.08) 0%, rgba(212, 175, 55, 0.04) 50%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className="section-label mb-5">Let&apos;s Work Together</div>

              <h2
                className="font-heading font-bold text-foreground mb-6"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Ready to Scale Your
                <br />
                <span className="text-gradient-gold">Business?</span>
              </h2>

              <p
                className="text-muted-foreground font-body max-w-xl mx-auto mb-10"
                style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
              >
                Tell us about your project and let&apos;s build something extraordinary together.
                Free consultation — no commitments, pure value.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEmailClick}
                  className="btn-primary text-base py-4 px-9 w-full sm:w-auto"
                  style={{ fontSize: '1rem' }}
                >
                  Start a Project
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="tel:+15550000000"
                  className="btn-outline text-base py-4 px-9 w-full sm:w-auto"
                  style={{ fontSize: '1rem' }}
                >
                  Schedule a Call
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                icon: Mail,
                label: 'Email Us',
                value: 'hello@prepoc.com',
                href: 'mailto:hello@prepoc.com',
              },
              {
                icon: Phone,
                label: 'Call Us',
                value: '+1 (555) 000-0000',
                href: 'tel:+15550000000',
              },
              {
                icon: MapPin,
                label: 'Visit Us',
                value: 'San Francisco, CA',
                href: '#',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="glass rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: 'rgba(14, 93, 71, 0.15)' }}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted text-xs tracking-wide">{item.label}</div>
                    <div className="text-foreground text-sm font-medium">{item.value}</div>
                  </div>
                </a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
