export interface TeamMember {
  id: number
  name: string
  title: string
  department: string
  bio: string
  image: string
  linkedin: string
  isFounder?: boolean
  isLeadership?: boolean
  isActive?: boolean
  message?: string
  messageExtended?: string
  credentials?: string[]
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface Value {
  icon: string
  title: string
  description: string
}

export interface GalleryItem {
  id: number
  type: 'image' | 'video'
  src: string
  videoSrc?: string
  alt: string
  size: 'normal' | 'tall' | 'wide'
  caption: string
}
