export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: Author;
  featuredImage: string;
  publishDate: string; // ISO string
  readingTime: string; // e.g. "5 min read"
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  isFeatured?: boolean;
}

export const CATEGORIES = [
  'All',
  'Web Development',
  'Digital Marketing',
  'SEO',
  'Branding',
  'AI Solutions',
  'Business Growth',
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'future-of-ai-automation-in-business',
    title: 'The Future of AI Automation in Business Growth',
    excerpt: 'Discover how AI-driven workflows and automation are reshaping the way modern businesses scale, reducing overhead while increasing operational efficiency.',
    content: '<p>Artificial intelligence is no longer just a buzzword; it is a fundamental shift in how businesses operate...</p>',
    category: 'AI Solutions',
    tags: ['AI', 'Automation', 'Scaling', 'Technology'],
    author: {
      name: 'PC Muhammed Aslam',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'Founder',
    },
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-05-12T10:00:00Z',
    readingTime: '6 min read',
    metaTitle: 'The Future of AI Automation in Business Growth | PREPOC',
    metaDescription: 'Discover how AI-driven workflows are reshaping modern businesses.',
    ogImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
  },
  {
    slug: 'seo-strategies-for-2024',
    title: 'Advanced SEO Strategies to Dominate Search Rankings in 2024',
    excerpt: 'Learn the exact strategies our team uses to consistently rank clients on the first page of Google, focusing on intent-driven content and technical SEO.',
    content: '<p>Search Engine Optimization is constantly evolving...</p>',
    category: 'SEO',
    tags: ['SEO', 'Google', 'Organic Traffic', 'Marketing'],
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Head of SEO',
    },
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-05-08T14:30:00Z',
    readingTime: '8 min read',
    metaTitle: 'Advanced SEO Strategies for 2024 | PREPOC',
    metaDescription: 'Learn the exact SEO strategies to dominate search rankings.',
    ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'building-high-performance-web-apps',
    title: 'Building High-Performance Web Apps with Next.js',
    excerpt: 'Why we choose Next.js and React for our enterprise clients, and how server-side rendering impacts core web vitals and overall user experience.',
    content: '<p>When it comes to building modern web applications...</p>',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Performance', 'Engineering'],
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Lead Developer',
    },
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-05-01T09:15:00Z',
    readingTime: '5 min read',
    metaTitle: 'High-Performance Web Apps with Next.js | PREPOC',
    metaDescription: 'Why we choose Next.js for enterprise web development.',
    ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'psychology-of-brand-identity',
    title: 'The Psychology Behind a Memorable Brand Identity',
    excerpt: 'A deep dive into color theory, typography, and visual language to create a brand identity that resonates emotionally with your target audience.',
    content: '<p>A brand is more than just a logo...</p>',
    category: 'Branding',
    tags: ['Design', 'Brand Strategy', 'Psychology'],
    author: {
      name: 'Emma Stone',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      role: 'Creative Director',
    },
    featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-04-25T11:00:00Z',
    readingTime: '7 min read',
    metaTitle: 'Psychology of Brand Identity | PREPOC',
    metaDescription: 'Create a brand identity that resonates emotionally with your audience.',
    ogImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'scaling-with-performance-marketing',
    title: 'Scaling E-Commerce with Data-Driven Performance Marketing',
    excerpt: 'Stop wasting ad spend. Learn how to implement robust tracking and analytics to lower CPA and increase ROAS across Meta and Google Ads.',
    content: '<p>Performance marketing requires a surgical approach to data...</p>',
    category: 'Digital Marketing',
    tags: ['PPC', 'E-Commerce', 'Meta Ads', 'Google Ads'],
    author: {
      name: 'David Wright',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Marketing Strategist',
    },
    featuredImage: 'https://images.unsplash.com/photo-1432888117426-1de5e354a3a6?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-04-18T16:45:00Z',
    readingTime: '9 min read',
    metaTitle: 'Scaling E-Commerce with Performance Marketing | PREPOC',
    metaDescription: 'Learn how to implement tracking to lower CPA and increase ROAS.',
    ogImage: 'https://images.unsplash.com/photo-1432888117426-1de5e354a3a6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'business-growth-in-recession',
    title: 'Strategies for Sustained Business Growth in a Volatile Market',
    excerpt: 'How leading companies adapt their product offerings and marketing strategies to maintain growth during periods of economic uncertainty.',
    content: '<p>Market volatility demands agility...</p>',
    category: 'Business Growth',
    tags: ['Strategy', 'Leadership', 'Economy'],
    author: {
      name: 'Muhammed Sahal',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      role: 'CEO',
    },
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-04-10T10:30:00Z',
    readingTime: '6 min read',
    metaTitle: 'Business Growth Strategies | PREPOC',
    metaDescription: 'How companies adapt to maintain growth during economic uncertainty.',
    ogImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'mobile-first-design-principles',
    title: 'Why Mobile-First Design is Non-Negotiable in 2024',
    excerpt: 'With over 60% of global web traffic coming from mobile devices, treating responsive design as an afterthought is costing you conversions.',
    content: '<p>The mobile-first approach is essential for any modern website...</p>',
    category: 'Web Development',
    tags: ['UX/UI', 'Mobile', 'Design', 'Development'],
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Lead Developer',
    },
    featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    publishDate: '2024-04-05T08:00:00Z',
    readingTime: '4 min read',
    metaTitle: 'Mobile-First Design Principles | PREPOC',
    metaDescription: 'Why mobile-first design is non-negotiable for conversions.',
    ogImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  }
];
