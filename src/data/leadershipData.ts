export interface Founder {
  name: string
  position: string
  message: string
  messageExtended?: string
  image: string
  linkedin: string
  credentials: string[]
  founderOrder?: number
}

export interface LeadershipMember {
  id: number
  name: string
  role: string
  image: string
  linkedin: string
}
