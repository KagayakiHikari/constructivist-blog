import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard"
};

export default async function AdminDashboardPage() {
  const [totalPosts, publishedPosts, draftPosts, imageCount, recentPosts] =
    await prisma.$transaction([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.image.count(),
      prisma.post.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6
      })
    ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.24em] text-construct-red">
            Control Panel
          </div>
          <h1 className="construct-heading mt-2 text-4xl text-construct-black md:text-5xl">
            DASHBOARD
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/posts/new" className="construct-button construct-button-primary">
            New Post
          </Link>
          <Link href="/admin/images" className="construct-button construct-button-secondary">
            Upload Image
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard number="01" label="Total posts" value={totalPosts} tone="white" />
        <StatCard number="02" label="Published" value={publishedPosts} tone="red" />
        <StatCard number="03" label="Drafts" value={draftPosts} tone="yellow" />
        <StatCard number="04" label="Images" value={imageCount} tone="blue" />
      </div>

      <section className="construct-card bg-white">
        <div className="flex items-center justify-between border-b-4 border-construct-black bg-construct-black px-5 py-4 text-white">
          <h2 className="construct-heading text-xl">RECENT POSTS</h2>
          <Link
            href="/admin/posts"
            className="font-display text-xs uppercase tracking-widest text-construct-yellow"
          >
            View all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="p-8 text-center font-display text-sm uppercase text-construct-muted">
            No posts yet
          </div>
        ) : (
          <div>
            {recentPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-dashed border-construct-black/10 px-5 py-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="construct-number font-display text-xl text-construct-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-base">{post.title}</div>
                    <div className="construct-number text-xs text-construct-muted">
                      {formatDateTime(post.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`construct-tag ${
                      post.status === "PUBLISHED"
                        ? "bg-construct-success text-white"
                        : "bg-construct-yellow text-black"
                    }`}
                  >
                    {post.status}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="construct-button construct-button-dark !px-3 !py-2"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
