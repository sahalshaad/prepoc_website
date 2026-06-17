import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    
    const where: any = {};
    if (search) {
      where.title = { contains: search }; // SQLite does not support mode: 'insensitive' natively in standard queries, but contains is usually fine or we rely on case sensitivity.
    }
    if (status) {
      where.status = status;
    }
    if (category) {
      where.categoryId = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        category: true,
        author: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, excerpt, status, categoryId, authorId, tags, featuredImage, seoTitle, seoDescription, isFeatured, isPinned } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title and slug are required' }, { status: 400 });
    }

    // Handle tags (array of strings)
    const tagConnections = tags?.map((tag: string) => {
      const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return {
        where: { slug: tagSlug },
        create: { name: tag, slug: tagSlug },
      };
    }) || [];

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content || '',
        excerpt,
        status: status || 'DRAFT',
        categoryId,
        authorId,
        featuredImage,
        seoTitle,
        seoDescription,
        isFeatured: !!isFeatured,
        isPinned: !!isPinned,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: {
          connectOrCreate: tagConnections,
        },
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
