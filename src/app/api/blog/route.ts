import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Failed to fetch published posts:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
