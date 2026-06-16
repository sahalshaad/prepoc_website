import { z } from 'zod'
import { isSafeUrl } from '@/utils/urlValidation'

// Helper for validating optional URLs
const safeUrlSchema = z.string()
  .url('Must be a valid URL')
  .refine(isSafeUrl, 'Invalid URL format (unsupported protocol)')
  .optional()
  .or(z.literal(''))

export const SocialLinksSchema = z.object({
  linkedin: safeUrlSchema,
  twitter: safeUrlSchema,
  github: safeUrlSchema,
  website: safeUrlSchema,
})

export const TeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  linkedin: safeUrlSchema,
  image: z.string().optional(),
  bio: z.string().optional(),
  message: z.string().optional(),
  messageExtended: z.string().optional(),
  isActive: z.boolean().optional(),
  isLeadership: z.boolean().optional(),
  isFounder: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  credentials: z.array(z.string()).optional()
})

export const PortfolioProjectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  clientName: z.string().min(2, 'Client name is required'),
  industry: z.string().min(2, 'Industry is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  resultsAchieved: z.string().min(2, 'Results are required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  bg: z.string().optional(),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  displayOrder: z.number().int().optional(),
  slug: z.string().min(2, 'Slug is required'),
  content: z.any().optional()
})

export const JobVacancySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  department: z.string().min(2, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance']),
  description: z.string().min(10, 'Description is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  salaryRange: z.string().optional(),
  isActive: z.boolean().optional()
})

export const JobApplicationSchema = z.object({
  vacancyId: z.string().min(1, 'Vacancy ID is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  portfolioUrl: safeUrlSchema,
  coverLetter: z.string().min(10, 'Cover letter must be at least 10 characters')
})

export const LeadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  serviceInterested: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  status: z.enum(['new', 'contacted', 'proposal_sent', 'converted', 'closed']).optional()
})

export const DepartmentSchema = z.object({
  name: z.string().min(2, 'Department name is required'),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional()
})

export const ServiceItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  desc: z.string().min(10, 'Description is required'),
  list: z.array(z.object({ text: z.string() })).min(1, 'At least one list item is required'),
  buttons: z.array(z.object({
    label: z.string(),
    href: z.string(),
    primary: z.boolean()
  })),
  image: z.string(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})
