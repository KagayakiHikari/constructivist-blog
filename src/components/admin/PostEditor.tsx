"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { Post } from "@prisma/client";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { slugifyText } from "@/lib/slugify";

export function PostEditor({ initialPost }: { initialPost?: Post }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost));
  const [summary, setSummary] = useState(initialPost?.summary ?? "");
  const [tags, setTags] = useState(initialPost?.tags ?? "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    (initialPost?.status as "DRAFT" | "PUBLISHED") ?? "DRAFT"
  );
  const [content, setContent] = useState(initialPost?.contentMarkdown ?? "");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const autoSlug = useMemo(() => slugifyText(title), [title]);

  function updateTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyText(value));
  }

  function wrapSelection(prefix: string, suffix: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextContent =
      content.slice(0, start) + prefix + selected + suffix + content.slice(end);

    setContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    });
  }

  function insertBlock(block: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = content.slice(0, start);
    const needsNewline = before.length > 0 && !before.endsWith("\n");
    const inserted = `${needsNewline ? "\n" : ""}${block}\n`;
    const nextContent = before + inserted + content.slice(start);

    setContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const position = (before + inserted).length;
      textarea.setSelectionRange(position, position);
    });
  }

  function insertImageMarkdown(url: string) {
    const alt = title.trim() || "Uploaded image";
    insertBlock(`![${alt}](${url})`);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/images", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      const image = data.images?.[0];
      if (!image) throw new Error("Upload response did not contain an image");

      insertImageMarkdown(image.url);
      if (!coverImage) setCoverImage(image.url);
      setMessage(`Image uploaded: ${image.originalName}`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        contentMarkdown: content,
        coverImage: coverImage.trim(),
        status,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 12)
      };

      const response = await fetch(
        initialPost ? `/api/admin/posts/${initialPost.id}` : "/api/admin/posts",
        {
          method: initialPost ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save post");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialPost) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${initialPost.id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  const toolbar = [
    { label: "H2", action: () => wrapSelection("\n## ", "\n", "Heading") },
    { label: "B", action: () => wrapSelection("**", "**", "bold") },
    { label: "I", action: () => wrapSelection("*", "*", "italic") },
    { label: "UL", action: () => insertBlock("- List item") },
    { label: "OL", action: () => insertBlock("1. Ordered item") },
    { label: "Quote", action: () => insertBlock("> Quote") },
    { label: "Link", action: () => wrapSelection("[", "](https://example.com)", "link text") },
    { label: "Code", action: () => wrapSelection("\n```\n", "\n```\n", "code") },
    {
      label: "Table",
      action: () =>
        insertBlock(
          "| Column A | Column B |\n| --- | --- |\n| Value 1 | Value 2 |"
        )
    },
    { label: "Image", action: () => fileInputRef.current?.click() },
    { label: preview ? "Editing" : "Preview", action: () => setPreview((value) => !value) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.24em] text-construct-red">
            {initialPost ? "Edit Post" : "New Post"}
          </div>
          <h1 className="construct-heading mt-2 text-4xl text-construct-black md:text-5xl">
            {initialPost ? "MODIFY SIGNAL" : "CREATE SIGNAL"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/posts" className="construct-button construct-button-dark !px-4 !py-2">
            Back
          </Link>
          <button
            type="button"
            className="construct-button construct-button-primary !px-4 !py-2"
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {initialPost ? (
            <button
              type="button"
              className="construct-button construct-button-danger !px-4 !py-2"
              onClick={() => setConfirmDelete(true)}
              disabled={saving}
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="border-4 border-construct-danger bg-construct-danger px-4 py-3 text-sm font-semibold text-white">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="border-4 border-construct-black bg-construct-success px-4 py-3 text-sm font-semibold text-white">
          {message}
        </div>
      ) : null}

      <div className="construct-card bg-white p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="construct-label" htmlFor="title">Title</label>
            <input
              id="title"
              className="construct-input"
              value={title}
              onChange={(event) => updateTitle(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="construct-label" htmlFor="slug">
              Slug {slugTouched ? "" : "(auto)"}
            </label>
            <input
              id="slug"
              className="construct-input"
              value={slugTouched ? slug : autoSlug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugTouched(true);
              }}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="construct-label" htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            className="construct-input min-h-[96px]"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <label className="construct-label" htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              className="construct-input"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Design, Frontend"
            />
          </div>

          <div>
            <label className="construct-label" htmlFor="status">Status</label>
            <select
              id="status"
              className="construct-input"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "DRAFT" | "PUBLISHED")
              }
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </div>

          <div>
            <label className="construct-label" htmlFor="coverImage">Cover image URL</label>
            <input
              id="coverImage"
              className="construct-input"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
              placeholder="/uploads/..."
            />
          </div>
        </div>
      </div>

      <div className="construct-card bg-white">
        <div className="construct-scrollbar flex flex-wrap items-center gap-2 border-b-4 border-construct-black bg-construct-black p-3">
          {toolbar.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="border-2 border-white px-3 py-2 font-display text-xs uppercase text-white transition-colors hover:bg-construct-yellow hover:text-black"
            >
              {item.label}
            </button>
          ))}
          {uploading ? (
            <span className="ml-2 font-display text-xs uppercase text-construct-yellow">
              Uploading...
            </span>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
          }}
        />

        <div className="grid lg:grid-cols-2">
          <div className={`border-b-4 border-construct-black lg:border-b-0 lg:border-r-4 ${preview ? "hidden lg:block" : "block"}`}>
            <textarea
              ref={textareaRef}
              className="construct-scrollbar min-h-[560px] w-full resize-y border-0 bg-white p-6 font-mono text-sm leading-relaxed outline-none"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="# Write your manifesto here"
            />
          </div>

          <div className={`bg-construct-paper ${preview ? "block" : "hidden lg:block"}`}>
            <div className="p-6 md:p-8">
              {content ? (
                <MarkdownContent content={content} />
              ) : (
                <div className="font-display text-lg uppercase text-construct-muted">
                  Preview is empty
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this post?"
        description="This action cannot be undone. The article will be removed permanently."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        busy={saving}
      />
    </div>
  );
}
