'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'
import { Highlight } from '@/components/ui/Highlight'

export default function CTA() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:info@prepoc.in'
  }

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden bg-white"
      aria-label="Contact and call to action"
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
              'radial-gradient(ellipse, rgba(59, 130, 246, 0.05) 0%, rgba(5, 150, 105, 0.02) 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA block */}
          <div className="bg-neutral-50 border border-neutral-200 shadow-sm rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 text-center mb-12 relative overflow-hidden">
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(5, 150, 105, 0.02) 50%, transparent 100%)',
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
              <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-5">Let&apos;s Work Together</div>

              <h2
                className="font-outfit font-medium text-black mb-6"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Ready to Scale Your
                <br />
                <Highlight color="text-blue-500/20"><span className="text-blue-500">Business?</span></Highlight>
              </h2>

              <p
                className="text-neutral-600 font-outfit max-w-xl mx-auto mb-10"
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
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-9 py-4 rounded-full hover:bg-neutral-800 transition-colors font-medium text-sm w-full sm:w-auto"
                >
                  Start a Project
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="tel:+919072595415"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black border border-neutral-300 px-9 py-4 rounded-full hover:bg-neutral-50 transition-colors font-medium text-sm w-full sm:w-auto"
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
                value: 'info@prepoc.in',
                href: 'mailto:info@prepoc.in',
              },
              {
                icon: Phone,
                label: 'Call Us',
                value: '+91 9072595415',
                href: 'tel:+919072595415',
              },
              {
                icon: MapPin,
                label: 'Visit Us',
                value: 'Pantheerankavu, Kozhikode, Kerala 673019',
                href: 'https://maps.google.com/?q=Pantheerankavu,Kozhikode,Kerala,India,673019',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-blue-500/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-blue-50"
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs tracking-wide font-outfit">{item.label}</div>
                    <div className="text-black text-sm font-semibold font-outfit">{item.value}</div>
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
