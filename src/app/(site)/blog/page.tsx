import { prisma } from '@/lib/prisma'
import BlogClient from './BlogClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | PREPOC Technologies',
  description: 'Insights, Strategies & Industry Updates on Digital Marketing, Web Development, Branding, SEO, and Business Growth.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  console.time('blog-posts-query')
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
  })
  console.timeEnd('blog-posts-query')

  // Normalize data for the client component
  const normalizedPosts = posts.map(post => ({
    ...post,
    categoryName: post.category?.name || 'Uncategorized',
    authorName: post.author?.name || 'Prepoc Team',
    authorAvatar: post.author?.image || '/placeholder.jpg',
    authorRole: post.author?.role || 'Contributor',
    tagsList: post.tags.map(t => t.name),
  }))

  console.time('blog-categories-query')
  const categories = await prisma.blogCategory.findMany()
  console.timeEnd('blog-categories-query')

  return <BlogClient initialPosts={normalizedPosts} categories={categories} />
}
