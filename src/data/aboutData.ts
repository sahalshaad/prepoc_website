/**
 * PREPOC Technologies — About Page Data
 *
 * DEMO DATA ONLY — Replace with real team members and office assets before launch.
 * All RandomUser URLs are for development purposes.
 */

// ─── Team Members ────────────────────────────────────────────────────────────

export interface TeamMember {
  id: number
  name: string
  title: string
  department: string
  bio: string
  /** RandomUser API image — swap with /images/team/<filename>.jpg for production */
  image: string
  linkedin: string
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Aisha Rahman',
    title: 'Chief Executive Officer',
    department: 'Leadership',
    bio: 'Visionary leader with 12+ years scaling digital agencies across South Asia and the Middle East. Passionate about building brands that last.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    title: 'Head of Growth Marketing',
    department: 'Digital Marketing',
    bio: 'Performance marketer who has driven 10x ROI campaigns for Fortune 500 clients. Specialist in Google Ads, Meta, and data-driven funnels.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 3,
    name: 'Zara Ahmed',
    title: 'Lead UI/UX Designer',
    department: 'Branding & Design',
    bio: 'Award-winning designer obsessed with pixel-perfect interfaces. Brings clarity and elegance to complex digital experiences.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 4,
    name: 'Kai Nakamura',
    title: 'Senior Full-Stack Developer',
    department: 'Web Development',
    bio: 'React & Next.js specialist building blazing-fast web applications. Open source contributor and tech speaker.',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 5,
    name: 'Priya Nair',
    title: 'Brand Strategist',
    department: 'Branding & Design',
    bio: 'Brand storyteller who transforms business visions into memorable identities. Has worked with 80+ brands across 15 industries.',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 6,
    name: 'Tariq Hassan',
    title: 'AI & Automation Lead',
    department: 'AI & Automation',
    bio: 'Building intelligent pipelines and AI-powered workflows that automate growth. Former ML engineer at a leading fintech startup.',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 7,
    name: 'Lena Müller',
    title: 'Video Production Director',
    department: 'Video Production',
    bio: 'Cinematic storyteller behind viral ad campaigns and brand documentaries. Specializes in motion design and aerial cinematography.',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 8,
    name: 'Omar Farooq',
    title: 'Mobile App Developer',
    department: 'Web Development',
    bio: 'Cross-platform mobile architect who has shipped 20+ apps to the App Store and Google Play. Flutter & React Native expert.',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 9,
    name: 'Sophia Chen',
    title: 'SEO & Content Strategist',
    department: 'Digital Marketing',
    bio: 'Organic growth specialist who has ranked 500+ keywords to page one. Content frameworks that convert traffic into revenue.',
    image: 'https://randomuser.me/api/portraits/women/90.jpg',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 10,
    name: 'Daniyal Khan',
    title: 'Account Manager',
    department: 'Leadership',
    bio: 'Client relationship builder ensuring every project exceeds expectations. Known for clear communication and on-time delivery.',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    linkedin: 'https://linkedin.com/',
  },
]

// ─── Department color map ─────────────────────────────────────────────────────

export const DEPARTMENT_COLORS: Record<string, string> = {
  Leadership: '#D4AF37',
  'Digital Marketing': '#0E5D47',
  'Branding & Design': '#ff00aa',
  'Web Development': '#00f3ff',
  'AI & Automation': '#9d00ff',
  'Video Production': '#ff5e00',
}

// ─── Company stats ────────────────────────────────────────────────────────────

export interface Stat {
  value: number
  suffix: string
  label: string
}

export const ABOUT_STATS: Stat[] = [
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 50, suffix: '+', label: 'Happy Clients' },
  { value: 5, suffix: '+', label: 'Years of Excellence' },
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
]

// ─── Company values ───────────────────────────────────────────────────────────

export interface Value {
  icon: string
  title: string
  description: string
}

export const COMPANY_VALUES: Value[] = [
  {
    icon: '🎯',
    title: 'Results First',
    description: 'Every decision is backed by data. We measure what matters and optimize relentlessly.',
  },
  {
    icon: '🤝',
    title: 'True Partnership',
    description: 'We treat your business as our own. Your wins are our wins, your challenges are ours to solve.',
  },
  {
    icon: '⚡',
    title: 'Speed & Precision',
    description: 'We move fast without cutting corners. Agile execution with an obsession for quality.',
  },
  {
    icon: '🌍',
    title: 'Global Thinking',
    description: 'World-class expertise delivered with local understanding across every market we serve.',
  },
]

// ─── Office Gallery ───────────────────────────────────────────────────────────

export type GalleryItemType = 'image' | 'video'

export interface GalleryItem {
  id: number
  type: GalleryItemType
  /** For images: URL. For videos: thumbnail URL. Swap with real assets for production. */
  src: string
  /** Only required when type === 'video' */
  videoSrc?: string
  alt: string
  /** Controls masonry sizing: 'tall' occupies 2 grid rows */
  size: 'normal' | 'tall' | 'wide'
  caption: string
}

// Using Unsplash for demo — swap all src values with real PREPOC office photos
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    alt: 'PREPOC open office workspace',
    size: 'tall',
    caption: 'Our Creative Hub',
  },
  {
    id: 2,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    alt: 'Team collaboration session',
    size: 'normal',
    caption: 'Strategy Sessions',
  },
  {
    id: 3,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80',
    alt: 'Modern meeting room',
    size: 'normal',
    caption: 'Innovation Lab',
  },
  {
    id: 4,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    alt: 'Team working on design',
    size: 'wide',
    caption: 'Design Studio',
  },
  {
    id: 5,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80',
    alt: 'Video production setup',
    size: 'tall',
    caption: 'Production Suite',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
    alt: 'Team lunch and culture',
    size: 'normal',
    caption: 'Team Culture',
  },
  {
    id: 7,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    alt: 'Developer workstation',
    size: 'normal',
    caption: 'Engineering Space',
  },
  {
    id: 8,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    alt: 'Client presentation',
    size: 'wide',
    caption: 'Client Presentations',
  },
  {
    id: 9,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
    alt: 'Creative brainstorm wall',
    size: 'normal',
    caption: 'Idea Walls',
  },
  {
    id: 10,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1573165850883-9b0e18c44bd2?w=800&q=80',
    alt: 'Team celebrating a launch',
    size: 'normal',
    caption: 'Launch Day',
  },
  {
    id: 11,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=800&q=80',
    alt: 'Rooftop office view',
    size: 'tall',
    caption: 'The Rooftop Lounge',
  },
  {
    id: 12,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
    alt: 'Agency awards on display',
    size: 'normal',
    caption: 'Our Awards',
  },
]
