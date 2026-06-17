import { PrismaClient } from '@prisma/client';
import { blogPosts, CATEGORIES } from '../src/data/blogData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Blog Data...');

  // 1. Seed Categories
  console.log('Seeding Categories...');
  for (const catName of CATEGORIES) {
    if (catName === 'All') continue;
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    await prisma.blogCategory.upsert({
      where: { slug },
      update: {},
      create: {
        name: catName,
        slug,
      },
    });
  }

  // 2. Seed Authors
  console.log('Seeding Authors...');
  const authorsMap = new Map<string, string>(); // name -> id
  for (const post of blogPosts) {
    if (!authorsMap.has(post.author.name)) {
      const author = await prisma.blogAuthor.create({
        data: {
          name: post.author.name,
          image: post.author.avatar,
          role: post.author.role,
        },
      });
      authorsMap.set(post.author.name, author.id);
    }
  }

  // 3. Seed Posts
  console.log('Seeding Posts...');
  for (const post of blogPosts) {
    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (!existing) {
      // Find category
      const catSlug = post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const category = await prisma.blogCategory.findUnique({ where: { slug: catSlug } });
      const authorId = authorsMap.get(post.author.name);

      await prisma.blogPost.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: 'PUBLISHED',
          categoryId: category?.id,
          authorId: authorId,
          featuredImage: post.featuredImage,
          ogImage: post.ogImage,
          seoTitle: post.metaTitle,
          seoDescription: post.metaDescription,
          estimatedReadTime: parseInt(post.readingTime) || 5,
          publishedAt: new Date(post.publishDate),
          isFeatured: post.isFeatured || false,
          tags: {
            connectOrCreate: post.tags.map((tag) => ({
              where: { slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') },
              create: { name: tag, slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') },
            })),
          },
        },
      });
      console.log(`Created post: ${post.title}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
