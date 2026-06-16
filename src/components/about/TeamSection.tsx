'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin } from 'lucide-react'
import Link from 'next/link'
import { isSafeUrl } from '@/utils/urlValidation'
import { type TeamMember } from '@/data/aboutData'


function TeamCard({ member, accentColor }: { member: TeamMember; accentColor: string }) {

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center text-center"
    >
      {/* Portrait */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4 rounded-full p-[2px] transition-transform duration-500 group-hover:scale-105">
        {/* Glow Ring (hover) */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, rgba(59,130,246,0.3), transparent)` }}
        />
        
        {/* Default subtle border */}
        <div className="absolute inset-0 rounded-full border border-neutral-200 group-hover:border-transparent transition-colors duration-500" />
        
        {/* Image Container */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-100">
          <Image
            src={member.image}
            alt={`${member.name}, ${member.title} at PREPOC`}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
            unoptimized // Remove when using local assets
          />
          {/* LinkedIn Icon Overlay */}
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

      {/* Info */}
      <h4 className="font-outfit font-semibold text-black text-base leading-tight mb-1">
        {member.name}
      </h4>
      <p className="text-xs font-medium text-neutral-500 font-outfit">
        {member.title}
      </p>
    </motion.div>
  )
}

export default function TeamSection({ members, colors, departments = ['All'] }: { members: TeamMember[]; colors: Record<string, string>; departments?: string[] }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredMembers = members.filter(
    (member) => activeFilter === 'All' || member.department === activeFilter
  )

  return (
    <section
      id="team"
      className="section-padding relative overflow-hidden min-h-[800px] bg-white"
      aria-label="Meet the PREPOC team"
    >
      {/* Ambient orb */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: '500px', height: '500px', top: '10%', right: '-150px', background: 'radial-gradient(circle, rgba(5, 150, 105, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
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
            <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">The People</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-outfit font-medium text-black mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
          >
            Meet the <span className="text-blue-500">Team.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-600 font-outfit max-w-2xl mx-auto"
            style={{ fontSize: '1.1rem', lineHeight: 1.75 }}
          >
            The people driving growth, creativity, and innovation at PREPOC.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12"
          role="tablist"
        >
          {departments.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={activeFilter === category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2.5 rounded-full font-outfit text-xs font-semibold transition-all duration-300 border min-h-[40px] ${
                activeFilter === category
                  ? 'bg-white text-black border-neutral-200 shadow-sm'
                  : 'bg-transparent text-neutral-500 hover:text-black border-transparent hover:border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Team grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 md:gap-y-14"
          role="list"
          aria-label="Team members"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <div key={member.id} role="listitem">
                <TeamCard member={member} accentColor={colors[member.department] ?? '#D4AF37'} />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-neutral-500 font-outfit text-sm mt-16"
        >
          Join our growing team. <Link href="/#contact" className="text-blue-600 hover:text-blue-700 underline transition-colors">View open positions.</Link>
        </motion.p>
      </div>
    </section>
  )
}
