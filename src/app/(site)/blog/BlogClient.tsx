'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

// Helper to format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

interface BlogClientProps {
  initialPosts: any[]
  categories: any[]
}

export default function BlogClient({ initialPosts, categories }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Derived state
  const featuredPost = useMemo(() => initialPosts.find(p => p.isFeatured) || initialPosts[0], [initialPosts])
  
  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.categoryName === activeCategory
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt || '').toLowerCase().includes(searchLower) ||
        (post.categoryName || '').toLowerCase().includes(searchLower) ||
        (post.tagsList || []).some((t: any) => t.toLowerCase().includes(searchLower))
      
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory])

  // For the sidebar
  const recentPosts = [...initialPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 4)
  const trendingPosts = [...initialPosts].sort((a, b) => b.views - a.views).slice(0, 4) 
  const allTags = Array.from(new Set(initialPosts.flatMap(p => p.tagsList))).slice(0, 10)

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-16 md:py-24 text-center overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0E5D47]/10 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#0E5D47] uppercase bg-[#0E5D47]/10 rounded-full border border-[#0E5D47]/20">
              PREPOC Insights
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-outfit text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900"
          >
            Insights, Strategies & <br className="hidden md:block" />Industry Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Stay ahead with expert insights on Digital Marketing, Web Development, Branding, SEO, AI Automation, and Business Growth.
          </motion.p>
        </div>
      </section>

      {/* Search & Filtering */}
      <section className="max-w-7xl mx-auto px-6 mb-16 space-y-10">
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full sm:w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, topics, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0E5D47]/20 focus:border-[#0E5D47] transition-all"
            />
          </div>
          <button 
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full shadow-md transition-all"
          >
            Find Now
          </button>
        </div>
        
        {/* Category Filters */}
            <div className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-4 max-w-full mx-auto w-max" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => setActiveCategory('All')}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  activeCategory === 'All'
                    ? 'bg-[#0E5D47] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0E5D47]/50 hover:text-[#0E5D47]'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                    activeCategory === cat.name
                      ? 'bg-[#0E5D47] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0E5D47]/50 hover:text-[#0E5D47]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (Featured & Grid) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Featured Post */}
          {(activeCategory === 'All' && !searchQuery && featuredPost) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                      {featuredPost.categoryName}
                    </span>
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {featuredPost.estimatedReadTime} min read
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight group-hover:text-white/90 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/80 line-clamp-2 md:line-clamp-3 max-w-2xl text-lg mt-3 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        src={featuredPost.authorAvatar}
                        alt={featuredPost.authorName}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white/20"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{featuredPost.authorName}</p>
                        <p className="text-xs text-white/60">{formatDate(featuredPost.publishedAt)}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`} className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-[#D4AF37] transition-colors">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid of Articles */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
              {searchQuery ? `Search Results (${filteredPosts.length})` : 'Latest Articles'}
            </h3>
            
            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 mb-2">No articles found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="text-[#0E5D47] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, idx) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] w-full overflow-hidden block">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#0E5D47] rounded-full shadow-sm">
                            {post.category}
                          </span>
                        </div>
                      </Link>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(post.publishedAt)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.estimatedReadTime} min</span>
                        </div>
                        <Link href={`/blog/${post.slug}`} className="block group-hover:text-[#0E5D47] transition-colors">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{post.title}</h4>
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <Image src={post.authorAvatar} alt={post.authorName} width={32} height={32} className="rounded-full" />
                            <span className="text-sm font-medium text-gray-900">{post.authorName}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <aside className="lg:col-span-4 space-y-10">
          
          {/* Trending Articles */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
               Trending Articles
            </h4>
            <div className="space-y-5">
              {trendingPosts.map(post => (
                <Link key={`trending-${post.slug}`} href={`/blog/${post.slug}`} className="group flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 group-hover:text-[#0E5D47] transition-colors line-clamp-2 mb-1 leading-snug">
                      {post.title}
                    </h5>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
               Recent Posts
            </h4>
            <div className="space-y-5">
              {recentPosts.map(post => (
                <Link key={`recent-${post.slug}`} href={`/blog/${post.slug}`} className="group flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 group-hover:text-[#0E5D47] transition-colors line-clamp-2 mb-1 leading-snug">
                      {post.title}
                    </h5>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Tag className="w-5 h-5 text-[#0E5D47]" /> Popular Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-[#0E5D47] hover:text-[#0E5D47] transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </aside>
      </section>

      {/* Newsletter CTA Section */}
      <section className="max-w-5xl mx-auto px-6 mt-12">
        <div className="relative bg-[#0E5D47] rounded-3xl overflow-hidden shadow-2xl p-8 md:p-16 text-center">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/80 text-lg">
              Get weekly insights on SEO, AI, Marketing, Branding, and Business Growth straight to your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your work email"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-gray-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-white/50 mt-4">
              Join 5,000+ industry leaders. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
