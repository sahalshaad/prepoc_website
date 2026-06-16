'use client'

import { motion } from 'framer-motion'
import { type Value } from '@/data/aboutData'

export default function CompanyValues({ values }: { values: Value[] }) {
  return (
    <section
      id="values"
      className="section-padding relative overflow-hidden bg-neutral-50"
      aria-label="PREPOC company values"
    >
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
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
            <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">What Drives Us</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-outfit font-medium text-black"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
          >
            Our Core <span className="text-blue-500">Values</span>
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
              className="group bg-white border border-neutral-200 shadow-sm rounded-3xl p-6 md:p-8 text-center hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Large number watermark */}
              <span className="absolute -top-4 -right-4 text-neutral-100 font-outfit font-bold opacity-50 select-none pointer-events-none" style={{ fontSize: '6rem', lineHeight: '1' }} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-transform duration-300 group-hover:scale-110 bg-blue-50 relative z-10"
                aria-hidden="true"
              >
                {value.icon}
              </div>

              <h3 className="font-outfit font-semibold text-black text-lg mb-3 relative z-10">
                {value.title}
              </h3>
              <p className="text-neutral-500 font-outfit text-sm leading-relaxed relative z-10">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
