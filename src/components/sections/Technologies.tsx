'use client'

import { motion } from 'framer-motion'
import { Highlight } from '@/components/ui/Highlight'

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
    <span className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 rounded-full border border-neutral-200 bg-white text-neutral-600 text-sm font-medium whitespace-nowrap transition-colors hover:text-black hover:border-neutral-300 shadow-sm">
      <span
        className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"
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
      className="section-padding relative overflow-hidden bg-white"
      style={{
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
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
          <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-2">Tech Stack</div>
          <h2
            className="font-outfit font-medium text-black mb-6"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}
          >
            Powered by{' '}
            <Highlight color="text-blue-500/20"><span className="text-blue-500">World-Class Technology</span></Highlight>
          </h2>
        </motion.div>
      </div>

      {/* Row 1: Left scroll */}
      <div className="marquee-container" aria-hidden="true">
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
            className="text-center text-neutral-500 text-xs tracking-widest uppercase mb-6"
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
                className="font-outfit font-bold text-neutral-300 hover:text-neutral-500 transition-colors"
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
