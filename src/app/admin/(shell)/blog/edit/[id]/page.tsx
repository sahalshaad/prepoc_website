import { BlogEditor } from '@/components/admin/blog/BlogEditor'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [categories, authors, post] = await Promise.all([
    prisma.blogCategory.findMany({ select: { id: true, name: true } }),
    prisma.blogAuthor.findMany({ select: { id: true, name: true } }),
    prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { tags: true }
    })
  ])

  if (!post) {
    notFound()
  }

  return <BlogEditor initialData={post} categories={categories} authors={authors} />
}
