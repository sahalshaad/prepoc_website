import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: true,
        tags: true,
        revisions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Failed to fetch post:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json();
    const { title, slug, content, excerpt, status, categoryId, authorId, tags, featuredImage, seoTitle, seoDescription, isFeatured, isPinned } = body;

    const existingPost = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Save a revision
    if (existingPost.content !== content) {
      await prisma.blogRevision.create({
        data: {
          postId: params.id,
          content: existingPost.content,
        },
      });
    }

    const tagConnections = tags?.map((tag: string) => {
      const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return {
        where: { slug: tagSlug },
        create: { name: tag, slug: tagSlug },
      };
    }) || [];

    const updatedPost = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        status,
        categoryId,
        authorId,
        featuredImage,
        seoTitle,
        seoDescription,
        isFeatured: !!isFeatured,
        isPinned: !!isPinned,
        publishedAt: status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' ? new Date() : existingPost.publishedAt,
        tags: {
          set: [], // clear existing
          connectOrCreate: tagConnections, // connect new
        },
      },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Failed to update post:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
