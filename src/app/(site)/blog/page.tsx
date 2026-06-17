import { prisma } from '@/lib/prisma'
import BlogClient from './BlogClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | PREPOC Technologies',
  description: 'Insights, Strategies & Industry Updates on Digital Marketing, Web Development, Branding, SEO, and Business Growth.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
  })

  // Normalize data for the client component
  const normalizedPosts = posts.map(post => ({
    ...post,
    categoryName: post.category?.name || 'Uncategorized',
    authorName: post.author?.name || 'Prepoc Team',
    authorAvatar: post.author?.image || '/placeholder.jpg',
    authorRole: post.author?.role || 'Contributor',
    tagsList: post.tags.map(t => t.name),
  }))

  const categories = await prisma.blogCategory.findMany()

  return <BlogClient initialPosts={normalizedPosts} categories={categories} />
}
