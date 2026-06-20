import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://prepoc.in'
  const isDev = process.env.NODE_ENV === 'development'
  const apiUrl = isDev ? 'http://localhost:3000' : baseUrl

  // Static routes
  const routes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/careers',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch dynamic blog posts
  let posts: Array<{ slug: string; updatedAt: string }> = []

  try {
    const res = await fetch(`${apiUrl}/api/sitemap-posts`, {
      cache: 'no-store'
    })

    if (res.ok) {
      const data = await res.json()
      posts = data.posts || []
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes]
}
