'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Quote } from 'lucide-react'
import { FOUNDER, LEADERSHIP_TEAM, type LeadershipMember } from '@/data/leadershipData'

// ─── Small circular card for the leadership row ───────────────────────────────

function LeaderCard({ member, index }: { member: LeadershipMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col items-center text-center"
    >
      {/* Portrait ring */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4 rounded-full p-[2px] transition-transform duration-500 group-hover:scale-105">
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(135deg, #D4AF37, transparent)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-transparent transition-colors duration-500" aria-hidden="true" />
        <div className="relative w-full h-full rounded-full overflow-hidden bg-black/30">
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role} at PREPOC`}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
            unoptimized
          />
          {/* LinkedIn hover overlay */}
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0a66c2] border border-white/20">
              <Linkedin className="w-3.5 h-3.5 text-white" />
            </div>
          </a>
        </div>
      </div>

      <h4 className="font-heading font-semibold text-foreground text-base leading-tight mb-1">
        {member.name}
      </h4>
      <p className="text-xs font-medium text-muted-foreground">{member.role}</p>
    </motion.div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function LeadershipSpotlight() {
  return (
    <section
      id="leadership"
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)' }}
      aria-label="PREPOC Leadership Spotlight"
    >
      {/* Ambient orbs */}
      <div
        className="orb orb-accent absolute pointer-events-none"
        style={{ width: '500px', height: '500px', top: '-80px', right: '-120px', opacity: 0.18 }}
        aria-hidden="true"
      />
      <div
        className="orb orb-primary absolute pointer-events-none"
        style={{ width: '350px', height: '350px', bottom: '0px', left: '-80px', opacity: 0.12 }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">

        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-4">Leadership</div>
            <div className="flex justify-center">
              <div className="section-divider" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-foreground mt-6 mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Meet the People{' '}
            <span className="text-gradient-green">Leading</span> PREPOC
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
          >
            Behind every successful project is a team guided by experience, vision, and a
            commitment to delivering measurable results.
          </motion.p>
        </div>

        {/* ── Founder Spotlight ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-20 max-w-5xl mx-auto">

          {/* Left — Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, rgba(14,93,71,0.22) 0%, transparent 70%)',
                filter: 'blur(30px)',
                transform: 'scale(1.1)',
              }}
              aria-hidden="true"
            />

            {/* Glass card */}
            <div
              className="relative rounded-[2rem] overflow-hidden max-w-[280px] sm:max-w-[360px] lg:max-w-[420px]"
              style={{
                width: '100%',
                aspectRatio: '4/5',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(14,93,71,0.25)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <Image
                src={FOUNDER.image}
                alt={`${FOUNDER.name}, ${FOUNDER.position} at PREPOC`}
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-top"
                priority
                unoptimized
              />

              {/* Bottom name overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-5"
                style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, transparent 100%)' }}
              >
                <p className="font-heading font-bold text-foreground text-xl leading-tight">
                  {FOUNDER.name}
                </p>
                <p className="text-sm font-medium" style={{ color: '#0E5D47' }}>
                  {FOUNDER.position}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Message */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Quote icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(14,93,71,0.12)', border: '1px solid rgba(14,93,71,0.3)' }}
              aria-hidden="true"
            >
              <Quote className="w-5 h-5" style={{ color: '#0E5D47' }} />
            </div>

            {/* Message paragraphs */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-foreground font-body mb-5 leading-relaxed"
              style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', lineHeight: 1.8 }}
            >
              &ldquo;{FOUNDER.message}&rdquo;
            </motion.p>

            {FOUNDER.messageExtended && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="text-muted-foreground font-body mb-8"
                style={{ fontSize: '1rem', lineHeight: 1.8 }}
              >
                {FOUNDER.messageExtended}
              </motion.p>
            )}

            {/* Credentials */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-2 mb-8"
              aria-label="Founder credentials"
            >
              {FOUNDER.credentials.map((cred) => (
                <li
                  key={cred}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(14,93,71,0.1)',
                    border: '1px solid rgba(14,93,71,0.3)',
                    color: '#0E5D47',
                    letterSpacing: '0.02em',
                  }}
                >
                  {cred}
                </li>
              ))}
            </motion.ul>

            {/* Divider */}
            <div className="h-px mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />

            {/* Name block + LinkedIn */}
            <div className="flex items-center gap-4">
              <div>
                <p className="font-heading font-bold text-foreground text-lg leading-tight">
                  {FOUNDER.name}
                </p>
                <p className="text-sm text-muted-foreground">{FOUNDER.position}</p>
              </div>

              <a
                href={FOUNDER.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${FOUNDER.name} on LinkedIn`}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: 'rgba(10,102,194,0.12)',
                  border: '1px solid rgba(10,102,194,0.35)',
                  color: '#5fa8d3',
                }}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-px mb-14 md:mb-16"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}
          aria-hidden="true"
        />

        {/* ── Leadership Row Label ──────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs tracking-widest uppercase mb-10"
          style={{ color: 'rgba(248,248,248,0.35)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em' }}
        >
          Leadership Team
        </motion.p>

        {/* ── Leadership Grid ───────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto"
          role="list"
          aria-label="PREPOC leadership team"
        >
          {LEADERSHIP_TEAM.map((member, index) => (
            <div role="listitem" key={member.id}>
              <LeaderCard member={member} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
