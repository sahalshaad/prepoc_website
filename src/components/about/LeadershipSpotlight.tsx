'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Quote } from 'lucide-react'
import { isSafeUrl } from '@/utils/urlValidation'
import { type Founder, type LeadershipMember } from '@/data/leadershipData'

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
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), transparent)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 rounded-full border border-neutral-200 group-hover:border-transparent transition-colors duration-500" aria-hidden="true" />
        <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-100">
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role} at PREPOC`}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
            unoptimized
          />
          {/* LinkedIn hover overlay */}
          {member.linkedin && isSafeUrl(member.linkedin) && (
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
          )}
        </div>
      </div>

      <h4 className="font-outfit font-semibold text-black text-base leading-tight mb-1">
        {member.name}
      </h4>
      <p className="text-xs font-medium text-neutral-500 font-outfit">{member.role}</p>
    </motion.div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function LeadershipSpotlight({ founder, team }: { founder: Founder; team: LeadershipMember[] }) {
  return (
    <section
      id="leadership"
      className="section-padding relative overflow-hidden bg-white"
      aria-label="PREPOC Leadership Spotlight"
    >
      {/* Ambient orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: '500px', height: '500px', top: '-80px', right: '-120px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: '350px', height: '350px', bottom: '0px', left: '-80px', background: 'radial-gradient(circle, rgba(5, 150, 105, 0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
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
            <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Leadership</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-outfit font-medium text-black mt-6 mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
          >
            Meet the People{' '}
            <span className="text-blue-500">Leading</span> PREPOC
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-600 font-outfit max-w-2xl mx-auto"
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
                background: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)',
                filter: 'blur(30px)',
                transform: 'scale(1.1)',
              }}
              aria-hidden="true"
            />

            {/* Glass card */}
            <div
              className="relative rounded-[2rem] overflow-hidden max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] bg-white border border-neutral-200 shadow-md"
              style={{
                width: '100%',
                aspectRatio: '4/5',
              }}
            >
              <Image
                src={founder.image}
                alt={`${founder.name}, ${founder.position} at PREPOC`}
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-top"
                priority
                unoptimized
              />

              {/* Bottom name overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-5"
                style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%)' }}
              >
                <p className="font-outfit font-bold text-black text-xl leading-tight">
                  {founder.name}
                </p>
                <p className="text-sm font-medium text-blue-600 font-outfit">
                  {founder.position}
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
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-blue-50 border border-blue-100"
              aria-hidden="true"
            >
              <Quote className="w-5 h-5 text-blue-500" />
            </div>

            {/* Message paragraphs */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-black font-outfit mb-5 leading-relaxed"
              style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', lineHeight: 1.8 }}
            >
              &ldquo;{founder.message}&rdquo;
            </motion.p>

            {founder.messageExtended && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="text-neutral-600 font-outfit mb-8"
                style={{ fontSize: '1rem', lineHeight: 1.8 }}
              >
                {founder.messageExtended}
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
              {founder.credentials.map((cred) => (
                <li
                  key={cred}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-outfit"
                  style={{
                    letterSpacing: '0.02em',
                  }}
                >
                  {cred}
                </li>
              ))}
            </motion.ul>

            {/* Divider */}
            <div className="h-px mb-8 bg-neutral-200" aria-hidden="true" />

            {/* Name block + LinkedIn */}
            <div className="flex items-center gap-4">
              <div>
                <p className="font-outfit font-bold text-black text-lg leading-tight">
                  {founder.name}
                </p>
                <p className="text-sm text-neutral-500 font-outfit">{founder.position}</p>
              </div>

              {founder.linkedin && isSafeUrl(founder.linkedin) && (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${founder.name} on LinkedIn`}
                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-outfit"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
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
          style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)' }}
          aria-hidden="true"
        />

        {/* ── Leadership Row Label ──────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs tracking-widest uppercase mb-10 text-neutral-400 font-outfit"
          style={{ letterSpacing: '0.15em' }}
        >
          Leadership Team
        </motion.p>

        {/* ── Leadership Grid ───────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto"
          role="list"
          aria-label="PREPOC leadership team"
        >
          {team.map((member, index) => (
            <div role="listitem" key={member.id}>
              <LeaderCard member={member} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
