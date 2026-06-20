import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
      },
    })
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching sitemap posts:', error)
    return NextResponse.json({ posts: [] }, { status: 500 })
  }
}
