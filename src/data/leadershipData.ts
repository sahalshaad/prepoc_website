/**
 * PREPOC Technologies — Leadership Spotlight Data
 *
 * DEMO DATA ONLY — Replace with real founder photo and details before launch.
 * Image paths: swap RandomUser URLs with /images/leadership/<filename>.jpg for production.
 */

// ─── Featured Founder ─────────────────────────────────────────────────────────

export interface Founder {
  name: string
  position: string
  /** Short paragraph shown next to the portrait */
  message: string
  /** A second paragraph for additional depth (optional) */
  messageExtended?: string
  image: string
  linkedin: string
  /** Credential badges shown below the message */
  credentials: string[]
}

export const FOUNDER: Founder = {
  name: 'Aisha Rahman',
  position: 'Founder & CEO',
  message:
    'PREPOC was built with one vision: helping businesses unlock their true growth potential through creativity, technology, and measurable strategies. Every partnership we build is rooted in trust, innovation, and long-term success.',
  messageExtended:
    'What started as a two-person consultancy has grown into a 30-strong team of specialists across marketing, design, engineering, video, and AI — united by a singular commitment to results.',
  image: 'https://randomuser.me/api/portraits/women/44.jpg',
  linkedin: 'https://linkedin.com/',
  credentials: [
    '12+ Years in Digital',
    'UAE & South Asia Markets',
    '150+ Brands Scaled',
  ],
}

// ─── Leadership Team Row ───────────────────────────────────────────────────────

export interface LeadershipMember {
  id: number
  name: string
  role: string
  image: string
  linkedin: string
}

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    id: 1,
    name: 'Rohan Mehta',
    role: 'Chief Technology Officer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 2,
    name: 'Zara Ahmed',
    role: 'Creative Director',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 3,
    name: 'Tariq Hassan',
    role: 'Head of Growth',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 4,
    name: 'Priya Nair',
    role: 'Operations Director',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
    linkedin: 'https://linkedin.com/',
  },
]
