'use client'

import { motion } from 'framer-motion'

// Tech names shown in marquee (no external images needed — text-based)
const techRow1 = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS',
  'PostgreSQL', 'MongoDB', 'AWS', 'Vercel', 'Docker', 'GraphQL',
]

const techRow2 = [
  'Figma', 'Adobe CC', 'GSAP', 'Framer Motion', 'Three.js', 'Webflow',
  'Shopify', 'WordPress', 'Stripe', 'Firebase', 'Supabase', 'OpenAI',
]

const clientLogos = [
  'NexusCorp', 'Lumina Co', 'Apex FinTech', 'ScaleUp', 'Meridian', 'ClearPath',
  'TechBridge', 'OmniMark', 'Elevate', 'CoreAxis',
]

function TechBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 rounded-full border border-white/8 bg-white/[0.03] text-muted text-sm font-medium whitespace-nowrap transition-colors hover:text-foreground hover:border-white/15">
      <span
        className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
        aria-hidden="true"
      />
      {name}
    </span>
  )
}

export default function Technologies() {
  return (
    <section
      id="technologies"
      className="py-16 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050505 0%, #080808 50%, #050505 100%)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      aria-label="Technologies we use"
    >
      <div className="container-wide mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="section-label mb-2">Tech Stack</div>
          <h2
            className="font-heading font-bold text-foreground"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}
          >
            Powered by{' '}
            <span className="text-gradient-gold">World-Class Technology</span>
          </h2>
        </motion.div>
      </div>

      {/* Row 1: Left scroll */}
      <div className="marquee-container mb-4" aria-hidden="true">
        <div className="marquee-track py-2">
          {[...techRow1, ...techRow1].map((tech, i) => (
            <TechBadge key={`r1-${i}`} name={tech} />
          ))}
        </div>
      </div>

      {/* Row 2: Right scroll */}
      <div className="marquee-container mb-10" aria-hidden="true">
        <div className="marquee-track-reverse py-2">
          {[...techRow2, ...techRow2].map((tech, i) => (
            <TechBadge key={`r2-${i}`} name={tech} />
          ))}
        </div>
      </div>

      {/* Client logos */}
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-muted text-xs tracking-widest uppercase mb-6"
        >
          Trusted by forward-thinking companies
        </motion.p>
        <div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8"
          aria-label="Client companies"
        >
          {clientLogos.map((logo, i) => (
            <motion.span
              key={logo}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="font-heading font-bold text-white/20 hover:text-white/50 transition-colors"
              style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)', letterSpacing: '-0.01em' }}
            >
              {logo}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
