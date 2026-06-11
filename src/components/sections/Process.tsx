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
    color: '#0E5D47',
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'Crafting a data-backed roadmap tailored to your unique objectives — every decision is intentional and measurable.',
    icon: Lightbulb,
    color: '#D4AF37',
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Our design team brings the strategy to life with stunning visuals, intuitive UX, and on-brand creative assets.',
    icon: Figma,
    color: '#0E5D47',
  },
  {
    number: '04',
    title: 'Develop',
    description:
      'Engineered to perform. We build fast, scalable, accessible solutions that push boundaries and exceed expectations.',
    icon: Code2,
    color: '#D4AF37',
  },
  {
    number: '05',
    title: 'Launch & Grow',
    description:
      'We don&apos;t just launch — we monitor, optimize, and scale. Continuous improvement is built into everything we do.',
    icon: Rocket,
    color: '#0E5D47',
  },
]

export default function Process() {
  return (
    <section
      id="process"
      className="section-padding bg-bg relative overflow-hidden"
      aria-label="Our process"
    >
      {/* Connecting line decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" aria-hidden="true" />

      <div className="container-wide">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-4">Our Approach</div>
            <div className="section-divider mx-auto" aria-hidden="true" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-foreground mb-6"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            How We Turn
            <br />
            <span className="text-gradient-gold">Vision Into Reality</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground font-body"
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
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-6 lg:space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isGold = step.color === '#D4AF37'
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
                      <div className="process-step group">
                        <div className="process-number" aria-hidden="true">
                          {step.number}
                        </div>

                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: isGold
                              ? 'rgba(212, 175, 55, 0.12)'
                              : 'rgba(14, 93, 71, 0.15)',
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
                          className="font-heading font-bold text-foreground mb-3"
                          style={{ fontSize: '1.4rem', letterSpacing: '-0.01em' }}
                        >
                          {step.title}
                        </h3>

                        <p
                          className="text-muted-foreground font-body leading-relaxed"
                          style={{ fontSize: '0.9rem' }}
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
