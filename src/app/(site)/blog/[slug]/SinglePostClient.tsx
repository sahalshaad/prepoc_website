'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calendar, ChevronRight, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import sanitizeHtml from 'sanitize-html'

// Helper to format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function SinglePostClient({ post, relatedPosts }: { post: any, relatedPosts: any[] }) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [copied, setCopied] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Increment view count via a simple API call
    fetch(`/api/blog/views?id=${post.id}`, { method: 'POST' }).catch(() => {})

    // Extract headings for Table of Contents
    const contentDiv = document.getElementById('article-content')
    if (contentDiv) {
      const headings = contentDiv.querySelectorAll('h2, h3')
      const tocItems: TOCItem[] = []
      
      headings.forEach((heading, index) => {
        const id = `heading-${index}`
        heading.id = id
        tocItems.push({
          id,
          text: heading.textContent || '',
          level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3
        })
      })
      setToc(tocItems)
    }
  }, [post.id])

  useEffect(() => {
    // Intersection Observer for highlighting active TOC item
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    toc.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [toc])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <article className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/blog" className="hover:text-[#0E5D47] transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#0E5D47] font-medium">{post.categoryName}</span>
          </nav>

          <header className="space-y-6 mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-y border-gray-100 py-4">
              <div className="flex items-center gap-3">
                <Image src={post.authorAvatar} alt={post.authorName} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">{post.authorName}</p>
                  <p className="text-xs">{formatDate(post.publishedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.estimatedReadTime} min read</span>
                <span className="flex items-center gap-1.5 text-gray-400">|</span>
                <span className="flex items-center gap-1.5">{post.views} views</span>
              </div>
            </div>
          </header>

          {post.featuredImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-sm">
              <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div 
            id="article-content"
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#0E5D47] hover:prose-a:text-[#0b4d3a] prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
              }
            }) }}
          />

          {/* Tags */}
          {post.tagsList && post.tagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
              {post.tagsList.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Block */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
            <span className="font-medium text-gray-900 flex items-center gap-2"><Share2 className="w-5 h-5" /> Share this article:</span>
            <div className="flex items-center gap-2">
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-[#1DA1F2] hover:text-white rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${post.title}`} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-[#0077B5] hover:text-white rounded-full transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-[#1877F2] hover:text-white rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <button onClick={handleCopyLink} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Table of Contents</h3>
              <ul className="space-y-3 text-sm">
                {toc.map(item => (
                  <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                    <a 
                      href={`#${item.id}`} 
                      className={`block transition-colors ${activeId === item.id ? 'text-[#0E5D47] font-semibold' : 'text-gray-600 hover:text-[#0E5D47]'}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <Image src={post.authorAvatar} alt={post.authorName} width={80} height={80} className="rounded-full mx-auto mb-4" />
            <h4 className="font-bold text-gray-900">{post.authorName}</h4>
            <p className="text-sm text-[#0E5D47] font-medium mb-3">{post.author?.role || 'Contributor'}</p>
            <p className="text-sm text-gray-600">{post.authorBio}</p>
          </div>
        </aside>

      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rel: any) => (
              <Link key={rel.id} href={`/blog/${rel.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="relative aspect-video">
                  <Image src={rel.featuredImage || '/placeholder.jpg'} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-[#0E5D47] uppercase">{rel.categoryName}</span>
                  <h4 className="font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-[#0E5D47] transition-colors">{rel.title}</h4>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span>{formatDate(rel.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-5xl mx-auto px-6 mt-20">
        <div className="bg-[#0E5D47] rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 text-center relative">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Never Miss an Update</h2>
            <p className="text-white/80 mb-8">Join thousands of leaders receiving our latest insights and strategies.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your work email" className="flex-1 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-white/50" required />
              <button type="submit" className="px-6 py-3 bg-[#D4AF37] text-gray-900 font-bold rounded-xl hover:bg-[#b5952f] transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
