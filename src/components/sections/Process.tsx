'use client'

import { motion } from 'framer-motion'
import { Search, Lightbulb, Figma, Code2, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We dive deep into your business, audience, competitors, and goals to build a comprehensive understanding of the landscape.',
    icon: Search,
    color: '#3b82f6', // blue-500
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'Crafting a data-backed roadmap tailored to your unique objectives — every decision is intentional and measurable.',
    icon: Lightbulb,
    color: '#059669', // emerald-600
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Our design team brings the strategy to life with stunning visuals, intuitive UX, and on-brand creative assets.',
    icon: Figma,
    color: '#3b82f6',
  },
  {
    number: '04',
    title: 'Develop',
    description:
      'Engineered to perform. We build fast, scalable, accessible solutions that push boundaries and exceed expectations.',
    icon: Code2,
    color: '#059669',
  },
  {
    number: '05',
    title: 'Launch & Grow',
    description:
      'We don&apos;t just launch — we monitor, optimize, and scale. Continuous improvement is built into everything we do.',
    icon: Rocket,
    color: '#3b82f6',
  },
]

export default function Process() {
  return (
    <section
      id="process"
      className="section-padding bg-neutral-50 relative overflow-hidden"
      aria-label="Our process"
    >
      {/* Connecting line decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-neutral-200" aria-hidden="true" />

      <div className="container-wide">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Our Approach</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-outfit font-medium text-black mb-6"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            How We Turn
            <br />
            <span className="text-blue-500">Vision Into Reality</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-600 font-outfit"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
          >
            A proven 5-step framework that transforms ideas into market-ready solutions
            with precision, creativity, and measurable impact.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connecting line on desktop */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 -translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-6 lg:space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isBlue = step.color === '#3b82f6'
              const isEven = index % 2 === 1

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${
                      isEven ? 'lg:direction-rtl' : ''
                    }`}
                  >
                    {/* Step card */}
                    <div className={isEven ? 'lg:order-2' : ''}>
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-4 right-6 text-[4rem] font-black text-black/5 select-none" aria-hidden="true">
                          {step.number}
                        </div>

                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: isBlue
                              ? 'rgba(59, 130, 246, 0.1)'
                              : 'rgba(5, 150, 105, 0.1)',
                          }}
                          aria-hidden="true"
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: step.color }}
                            strokeWidth={1.75}
                          />
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="text-xs font-bold tracking-widest uppercase"
                            style={{ color: step.color }}
                          >
                            Step {step.number}
                          </span>
                        </div>

                        <h3
                          className="font-outfit font-semibold text-black mb-3"
                          style={{ fontSize: '1.4rem', letterSpacing: '-0.01em' }}
                        >
                          {step.title}
                        </h3>

                        <p
                          className="text-neutral-600 font-outfit leading-relaxed"
                          style={{ fontSize: '0.95rem' }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className={`hidden lg:block ${isEven ? 'lg:order-1' : ''}`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
