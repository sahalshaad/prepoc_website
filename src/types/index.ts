export interface Service {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: string
}

export interface Project {
  id: string
  title: string
  category: string
  tags: string[]
  description: string
  gradient: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  initials: string
}

export interface NavItem {
  label: string
  href: string
}
