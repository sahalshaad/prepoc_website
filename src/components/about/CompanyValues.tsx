'use client'

import { motion } from 'framer-motion'
import { type Value } from '@/data/aboutData'

export default function CompanyValues({ values }: { values: Value[] }) {
  return (
    <section
      id="values"
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)' }}
      aria-label="PREPOC company values"
    >
      <div
        className="orb orb-accent absolute"
        style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px', opacity: 0.15 }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-4">What Drives Us</div>
            <div className="flex justify-center">
              <div className="section-divider" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-foreground"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Our Core <span className="text-gradient-green">Values</span>
          </motion.h2>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group process-step text-center"
            >
              {/* Large number watermark */}
              <span className="process-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'rgba(14, 93, 71, 0.15)', border: '1px solid rgba(14, 93, 71, 0.3)' }}
                aria-hidden="true"
              >
                {value.icon}
              </div>

              <h3 className="font-heading font-semibold text-foreground text-lg mb-3">
                {value.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
