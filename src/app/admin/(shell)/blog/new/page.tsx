import { BlogEditor } from '@/components/admin/blog/BlogEditor'
import { prisma } from '@/lib/prisma'

export default async function NewBlogPostPage() {
  const [categories, authors] = await Promise.all([
    prisma.blogCategory.findMany({ select: { id: true, name: true } }),
    prisma.blogAuthor.findMany({ select: { id: true, name: true } })
  ])

  return <BlogEditor categories={categories} authors={authors} />
}
