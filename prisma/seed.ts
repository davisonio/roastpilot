import { PrismaClient } from "../src/generated/prisma";
import { SEED_POSTS } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log(`Loading ${SEED_POSTS.length} seed posts...`);

  await prisma.comment.deleteMany({ where: { isSeed: true } });
  await prisma.post.deleteMany({ where: { isSeed: true } });

  for (const seed of SEED_POSTS) {
    const post = await prisma.post.create({
      data: {
        authorName: seed.authorName,
        title: seed.title,
        body: seed.body,
        isPinned: seed.isPinned ?? false,
        aiVerdict: seed.aiVerdict ?? null,
        aiResponse: seed.aiResponse ?? null,
        isSeed: true,
      },
    });

    if (seed.comments.length > 0) {
      await prisma.comment.createMany({
        data: seed.comments.map((c) => ({
          postId: post.id,
          authorName: c.authorName,
          verdict: c.verdict,
          body: c.body,
          isSeed: true,
        })),
      });
    }

    console.log(`  ✓ ${seed.title.slice(0, 70)}`);
  }

  const count = await prisma.post.count();
  console.log(`Done. ${count} posts in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
