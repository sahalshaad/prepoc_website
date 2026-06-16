// ============================================================
// PREPOC CMS — Admin TypeScript Types
// src/types/admin.ts
// ============================================================

// ─── Auth & Users ────────────────────────────────────────────

export type UserRole =
  | 'super_admin'
  | 'marketing_manager'
  | 'content_editor'
  | 'hr_manager'
  | 'developer'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLogin: string
  isActive: boolean
}

// ─── Home Page ───────────────────────────────────────────────

export interface HeroStat {
  value: number
  suffix: string
  label: string
}

export interface HeroData {
  heading: string
  highlightedWords: string[]
  description: string
  primaryCTA: { label: string; href: string }
  secondaryCTA: { label: string; href: string }
  stats: HeroStat[]
  marqueeItems: string[]
  cubeConfig: {
    speed: number
    color: string
    wireframe: boolean
  }
}

// ─── About Page ──────────────────────────────────────────────

export interface AboutHeroData {
  heading: string
  description: string
  bannerMedia: { type: 'image' | 'video'; url: string }
}

export interface Milestone {
  id: string
  year: string
  title: string
  description: string
}

export interface StoryData {
  content: string
  milestones: Milestone[]
}

export interface FounderData {
  name: string
  position: string
  message: string
  messageExtended?: string
  image: string
  linkedin: string
  credentials: string[]
}

export interface LeadershipMemberCMS {
  id: string
  name: string
  role: string
  image: string
  linkedin: string
  displayOrder: number
}

export interface CoreValue {
  id: string
  icon: string
  title: string
  description: string
  displayOrder: number
}

export interface AboutCTAData {
  title: string
  description: string
  primaryCTA: { label: string; href: string }
  secondaryCTA: { label: string; href: string }
}

// ─── Team ────────────────────────────────────────────────────

export interface DepartmentCMS {
  id: string
  name: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface TeamMemberCMS {
  id: string
  name: string
  title: string
  department: string
  bio: string
  image: string
  linkedin: string
  email?: string
  displayOrder: number
  isLeadership: boolean
  isFounder?: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─── Services ────────────────────────────────────────────────

export interface ServiceCMS {
  id: string
  title: string
  desc: string
  list: { text: string }[]
  buttons: { label: string; href: string; primary: boolean }[]
  image: string
  isActive: boolean
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

// ─── Portfolio ───────────────────────────────────────────────

export type ProjectStatus = 'draft' | 'published'

export interface PortfolioProject {
  id: string
  title: string
  clientName: string
  industry: string
  description: string
  resultsAchieved: string
  tags: string[]
  coverImage: string
  galleryImages: string[]
  videoUrl?: string
  isFeatured: boolean
  status: ProjectStatus
  displayOrder: number
  bg?: string
  slug?: string
  createdAt: string
  updatedAt: string
}

// ─── Testimonials ────────────────────────────────────────────

export interface TestimonialCMS {
  id: string
  clientName: string
  company: string
  position: string
  reviewText: string
  rating: 1 | 2 | 3 | 4 | 5
  profileImage?: string
  isPublished: boolean
  displayOrder: number
  createdAt: string
}

// ─── Gallery ─────────────────────────────────────────────────

export interface GalleryItemCMS {
  id: string
  type: 'image' | 'video'
  src: string
  videoSrc?: string
  alt: string
  caption: string
  size: 'normal' | 'tall' | 'wide'
  displayOrder: number
  createdAt: string
}

// ─── Media Library ───────────────────────────────────────────

export type MediaCategory = 'image' | 'video' | 'logo' | 'document'

export interface MediaAsset {
  id: string
  filename: string
  url: string
  cdnUrl: string
  category: MediaCategory
  mimeType: string
  sizeBytes: number
  width?: number
  height?: number
  altText?: string
  tags: string[]
  uploadedBy: string
  createdAt: string
}

// ─── Leads ───────────────────────────────────────────────────

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'proposal_sent'
  | 'converted'
  | 'closed'

export interface ContactLead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  serviceInterested?: string
  message: string
  status: LeadStatus
  assignedTo?: string
  notes?: string
  submittedAt: string
  updatedAt: string
}

// ─── SEO ─────────────────────────────────────────────────────

export interface PageSEO {
  id: string
  pageSlug: string
  metaTitle: string
  metaDescription: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  structuredData?: string
  updatedAt: string
}

// ─── Dashboard ───────────────────────────────────────────────

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  teamCount: number
  activeServices: number
  publishedProjects: number
  totalAssets: number
}

export interface ActivityEvent {
  id: string
  type: 'lead' | 'team' | 'portfolio' | 'service' | 'media' | 'auth'
  message: string
  user: string
  timestamp: string
}

// ─── Careers ─────────────────────────────────────────────────

export interface JobVacancy {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  description: string
  requirements: string
  responsibilities: string
  benefits: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'interview_scheduled' | 'hired' | 'rejected'

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  name: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  portfolioUrl?: string
  coverLetter: string
  resumeUrl: string
  status: ApplicationStatus
  submittedAt: string
  updatedAt: string
}
