import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import { TagBadge } from "@/components/public/TagBadge";
import { formatDateTime } from "@/lib/format";
import { safeMarkdownUrl } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" }
  });

  if (!post) notFound();

  const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];
  const coverImage = safeMarkdownUrl(post.coverImage ?? undefined);

  return (
    <article>
      <header className="relative overflow-hidden border-b-8 border-construct-black bg-construct-black text-white">
        <div className="absolute -right-16 top-8 h-64 w-64 rotate-12 bg-construct-red" />
        <div className="absolute bottom-0 left-0 h-3 w-full bg-[repeating-linear-gradient(90deg,#F7C61A_0,#F7C61A_24px,#1D4ED8_24px,#1D4ED8_48px)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
          <Link
            href="/posts"
            className="construct-button construct-button-secondary !px-4 !py-2"
          >
            ← Posts
          </Link>
          <h1 className="construct-heading mt-8 text-4xl text-white md:text-7xl">
            {post.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="construct-tag bg-construct-yellow text-black">
              {formatDateTime(post.publishedAt || post.createdAt)}
            </span>
            {tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
        </div>
      </header>

      {coverImage ? (
        <div className="mx-auto -mt-10 max-w-5xl px-4 md:px-8">
          <div className="construct-card bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={post.title}
              className="max-h-[520px] w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
        {post.summary ? (
          <div className="construct-card construct-clip mb-10 bg-construct-yellow p-6">
            <div className="font-display text-xs uppercase tracking-[0.2em]">
              Summary
            </div>
            <p className="mt-3 text-lg font-semibold leading-relaxed text-black">
              {post.summary}
            </p>
          </div>
        ) : null}

        <div className="construct-card bg-white p-6 md:p-10">
          {post.contentMarkdown ? (
            <MarkdownContent content={post.contentMarkdown} />
          ) : (
            <p className="font-display text-lg uppercase">No content.</p>
          )}
        </div>
      </div>
    </article>
  );
}
