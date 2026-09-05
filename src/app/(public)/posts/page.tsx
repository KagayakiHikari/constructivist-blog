import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/public/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Posts"
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }]
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="relative border-b-8 border-construct-black pb-8">
        <div className="font-display text-xs uppercase tracking-[0.28em] text-construct-red">
          Index
        </div>
        <h1 className="construct-heading mt-4 text-5xl text-construct-black md:text-8xl">
          POSTS
        </h1>
        <div className="absolute bottom-8 right-0 hidden h-16 w-32 bg-construct-yellow md:block" />
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              title="NO POST YET"
              description="No published article exists. Create one from the admin panel."
              action={
                <Link href="/login" className="construct-button construct-button-primary">
                  Login
                </Link>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
