import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SinglePostClient from './SinglePostClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  })

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.seoTitle || `${post.title} | PREPOC Technologies`,
    description: post.seoDescription || post.excerpt || '',
    keywords: post.seoKeywords || '',
    alternates: {
      canonical: post.canonicalUrl || `https://prepoc.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      url: `https://prepoc.in/blog/${post.slug}`,
      images: [
        {
          url: post.ogImage || post.featuredImage || '/images/default-og.jpg',
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        }
      ],
      type: 'article',
      authors: post.author ? [post.author.name] : [],
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      images: [post.ogImage || post.featuredImage || ''],
    }
  }
}

export default async function SinglePostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: true,
      tags: true,
    }
  })

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: post.categoryId,
      NOT: { id: post.id }
    },
    take: 3,
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' }
  })

  const normalizedPost = {
    ...post,
    categoryName: post.category?.name || 'Uncategorized',
    authorName: post.author?.name || 'Prepoc Team',
    authorAvatar: post.author?.image || '/placeholder.jpg',
    authorBio: post.author?.bio || '',
    tagsList: post.tags.map(t => t.name),
  }

  const normalizedRelated = relatedPosts.map(p => ({
    ...p,
    categoryName: p.category?.name || 'Uncategorized',
    authorName: p.author?.name || 'Prepoc Team',
    authorAvatar: p.author?.image || '/placeholder.jpg',
  }))

  return (
    <>
      {post.schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: post.schemaMarkup }} />
      )}
      <SinglePostClient post={normalizedPost} relatedPosts={normalizedRelated} />
    </>
  )
}
