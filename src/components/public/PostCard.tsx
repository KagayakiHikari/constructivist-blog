import Link from "next/link";
import type { Post } from "@prisma/client";
import { TagBadge } from "@/components/public/TagBadge";
import { formatDate } from "@/lib/format";

export function PostCard({ post, index }: { post: Post; index: number }) {
  const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];

  return (
    <article className="construct-card construct-card-hover construct-clip">
      <div className="flex items-stretch border-b-4 border-construct-black">
        <div className="flex w-20 shrink-0 items-center justify-center bg-construct-red font-display text-3xl text-white">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-3">
          <div className="font-display text-[10px] uppercase tracking-[0.2em] text-construct-muted">
            Article / {post.status}
          </div>
          <time className="construct-number font-display text-sm text-construct-black">
            {formatDate(post.publishedAt || post.createdAt)}
          </time>
        </div>
      </div>

      {post.coverImage ? (
        <div className="border-b-4 border-construct-black bg-construct-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-52 w-full object-cover opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
      ) : (
        <div className="relative h-32 border-b-4 border-construct-black bg-[repeating-linear-gradient(135deg,#F7C61A_0,#F7C61A_20px,#0B0B0B_20px,#0B0B0B_40px)]">
          <div className="absolute right-6 top-5 h-16 w-16 bg-construct-red" />
        </div>
      )}

      <div className="space-y-4 p-6">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="construct-heading text-2xl text-construct-black hover:text-construct-red md:text-3xl">
            {post.title}
          </h2>
        </Link>
        <p className="line-clamp-3 text-sm leading-relaxed text-construct-muted">
          {post.summary || "No summary provided."}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
        <div className="flex items-center justify-between border-t-4 border-dashed border-construct-black/20 pt-4">
          <span className="font-display text-xs uppercase tracking-[0.2em]">
            Read
          </span>
          <Link
            href={`/posts/${post.slug}`}
            className="construct-button construct-button-primary !px-4 !py-2"
          >
            Enter →
          </Link>
        </div>
      </div>
    </article>
  );
}
