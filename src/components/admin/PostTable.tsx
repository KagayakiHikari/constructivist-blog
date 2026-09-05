"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Post } from "@prisma/client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/format";

export function PostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const postToDelete = posts.find((post) => post.id === deleteId) || null;

  async function toggleStatus(post: Post) {
    setBusyId(post.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          contentMarkdown: post.contentMarkdown,
          coverImage: post.coverImage || "",
          status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
          tags: post.tags ? post.tags.split(",").filter(Boolean) : []
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Failed to update status"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!postToDelete) return;

    setBusyId(postToDelete.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${postToDelete.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }

      setDeleteId(null);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete post"
      );
    } finally {
      setBusyId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="NO POST"
        description="Create your first article and start filling the wall."
        action={
          <Link href="/admin/posts/new" className="construct-button construct-button-primary">
            New Post
          </Link>
        }
      />
    );
  }

  return (
    <>
      {error ? (
        <div className="mb-4 border-4 border-construct-danger bg-construct-danger px-4 py-3 text-sm font-semibold text-white">
          {error}
        </div>
      ) : null}

      <div className="construct-card construct-scrollbar overflow-x-auto bg-white">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-construct-black text-white">
              <th className="px-4 py-4 font-display text-xs uppercase tracking-widest">#</th>
              <th className="px-4 py-4 font-display text-xs uppercase tracking-widest">Title</th>
              <th className="px-4 py-4 font-display text-xs uppercase tracking-widest">Status</th>
              <th className="px-4 py-4 font-display text-xs uppercase tracking-widest">Updated</th>
              <th className="px-4 py-4 font-display text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr
                key={post.id}
                className="border-b-4 border-construct-black/10 odd:bg-white even:bg-construct-paper/60"
              >
                <td className="px-4 py-4 font-display text-lg">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-4">
                  <div className="font-display text-base">{post.title}</div>
                  <div className="mt-1 text-xs text-construct-muted">/{post.slug}</div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`construct-tag ${
                      post.status === "PUBLISHED"
                        ? "bg-construct-success text-white"
                        : "bg-construct-yellow text-black"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="construct-number px-4 py-4 text-xs">
                  {formatDateTime(post.updatedAt)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="construct-button construct-button-secondary !px-3 !py-2"
                      onClick={() => toggleStatus(post)}
                      disabled={busyId === post.id}
                    >
                      {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="construct-button construct-button-dark !px-3 !py-2"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="construct-button construct-button-danger !px-3 !py-2"
                      onClick={() => setDeleteId(post.id)}
                      disabled={busyId === post.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(postToDelete)}
        title="Delete this post?"
        description={`This will permanently remove "${postToDelete?.title}" and cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        busy={Boolean(busyId)}
      />
    </>
  );
}
