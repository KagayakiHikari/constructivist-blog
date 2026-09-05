import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostTable } from "@/components/admin/PostTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Posts"
};

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.24em] text-construct-red">
            Content Registry
          </div>
          <h1 className="construct-heading mt-2 text-4xl text-construct-black md:text-5xl">
            POSTS
          </h1>
        </div>
        <Link href="/admin/posts/new" className="construct-button construct-button-primary">
          New Post
        </Link>
      </div>

      <PostTable posts={posts} />
    </div>
  );
}
