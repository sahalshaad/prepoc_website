'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { Highlight } from '@/components/ui/Highlight'

interface FaqItem {
  id: string
  question: string
  answer: string
}

export default function FAQClient({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  if (faqs.length === 0) return null

  return (
    <section
      id="faq"
      className="section-padding relative overflow-hidden bg-neutral-50"
      aria-label="Frequently asked questions"
    >
      {/* Background orb */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">
              FAQ
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-outfit font-medium text-black mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Got{' '}
            <Highlight color="text-blue-500/20">
              <span className="text-blue-500">Questions?</span>
            </Highlight>
            <br />
            We Have Answers.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-500 font-outfit"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
          >
            Everything you need to know about working with PREPOC Technologies.
            Can&apos;t find your answer? Feel free to{' '}
            <a
              href="mailto:info@prepoc.in"
              className="text-blue-500 hover:underline underline-offset-2 transition-all"
            >
              reach out directly
            </a>
            .
          </motion.p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto" role="list" aria-label="FAQ accordion">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                role="listitem"
                className="mb-3"
              >
                <div
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? 'border-blue-200 shadow-md'
                      : 'border-neutral-200 shadow-sm hover:border-blue-200/60 hover:shadow-md'
                  }`}
                >
                  {/* Question */}
                  <button
                    id={`${faq.id}-btn`}
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-panel`}
                    onClick={() => toggle(faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 cursor-pointer group"
                  >
                    <span
                      className={`font-outfit font-semibold text-base transition-colors duration-200 ${
                        isOpen ? 'text-blue-600' : 'text-black group-hover:text-blue-600'
                      }`}
                    >
                      {faq.question}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isOpen
                          ? 'bg-blue-500 text-white'
                          : 'bg-neutral-100 text-neutral-600 group-hover:bg-blue-50 group-hover:text-blue-500'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${faq.id}-panel`}
                        role="region"
                        aria-labelledby={`${faq.id}-btn`}
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="w-full h-px bg-neutral-100 mb-4" aria-hidden="true" />
                          <p
                            className="text-neutral-600 font-outfit leading-relaxed"
                            style={{ fontSize: '0.95rem', lineHeight: 1.8 }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
