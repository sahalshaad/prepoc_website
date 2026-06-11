'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 'test-1',
    name: 'Sarah Mitchell',
    role: 'CEO',
    company: 'Nexus Commerce',
    content:
      'PREPOC transformed our digital presence completely. In just 6 months, we saw a 340% increase in online revenue. Their team\'s expertise in performance marketing and web development is genuinely world-class.',
    rating: 5,
    initials: 'SM',
    accentColor: '#0E5D47',
  },
  {
    id: 'test-2',
    name: 'James Okoye',
    role: 'Marketing Director',
    company: 'Lumina Collective',
    content:
      'The rebrand PREPOC delivered exceeded every expectation. They understood our vision better than we did ourselves — the brand film alone generated 5 million impressions in the first week.',
    rating: 5,
    initials: 'JO',
    accentColor: '#D4AF37',
  },
  {
    id: 'test-3',
    name: 'Priya Sharma',
    role: 'Founder',
    company: 'Apex FinTech',
    content:
      'Building our AI-powered app with PREPOC was an exceptional experience. Their technical depth is impressive — 4.9 stars on the App Store and 80,000 users in six months says everything.',
    rating: 5,
    initials: 'PS',
    accentColor: '#0E5D47',
  },
  {
    id: 'test-4',
    name: 'David Chen',
    role: 'COO',
    company: 'ScaleUp Ventures',
    content:
      'We\'ve worked with many agencies, but PREPOC stands apart. They\'re strategic thinkers first, executers second. The SEO results alone generated $2M in additional pipeline this year.',
    rating: 5,
    initials: 'DC',
    accentColor: '#D4AF37',
  },
]

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding bg-bg relative overflow-hidden"
      aria-label="Client testimonials"
    >
      {/* Background orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(14, 93, 71, 0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-4">Testimonials</div>
            <div className="section-divider mx-auto" aria-hidden="true" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-foreground mb-4"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Trusted by Leaders
            <br />
            <span className="text-gradient-gold">Across Industries.</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          role="list"
          aria-label="Client testimonials"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              role="listitem"
            >
              <div className="testimonial-card h-full" data-cursor-hover>
                {/* Stars */}
                <div
                  className="flex items-center gap-1 mb-5"
                  role="img"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote
                  className="text-foreground/85 font-body leading-relaxed mb-8 relative z-10"
                  style={{ fontSize: '0.95rem' }}
                >
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm text-foreground"
                    style={{
                      background: `rgba(${testimonial.accentColor === '#0E5D47' ? '14, 93, 71' : '212, 175, 55'}, 0.2)`,
                      border: `1px solid rgba(${testimonial.accentColor === '#0E5D47' ? '14, 93, 71' : '212, 175, 55'}, 0.4)`,
                    }}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-muted text-xs">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-8 border-t border-white/5"
          aria-label="Platform ratings"
        >
          {[
            { platform: 'Clutch', score: '4.9/5', reviews: '40+ Reviews' },
            { platform: 'GoodFirms', score: '5.0/5', reviews: '25+ Reviews' },
            { platform: 'DesignRush', score: 'Top Agency', reviews: '2024' },
          ].map((item) => (
            <div key={item.platform} className="text-center">
              <div className="font-heading font-bold text-foreground text-lg">{item.score}</div>
              <div className="text-accent text-xs font-semibold">{item.platform}</div>
              <div className="text-muted text-xs">{item.reviews}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
