"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Image as ImageModel } from "@prisma/client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatDateTime, formatFileSize } from "@/lib/format";

export function ImageManager() {
  const [images, setImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/images");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load images");
      }

      setImages(data.images);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      const files = Array.from(event.clipboardData?.files || []);
      if (files.length > 0) {
        event.preventDefault();
        void uploadFiles(files);
      }
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/admin/images", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload images");
      }

      setImages((current) => [...data.images, ...current]);
      setMessage(`${data.images.length} image(s) uploaded.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied.`);
    } catch {
      setError("Clipboard is unavailable in this browser.");
    }
  }

  const imageToDelete = images.find((image) => image.id === deleteId) || null;

  async function handleDelete() {
    if (!imageToDelete) return;

    setBusyId(imageToDelete.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/images/${imageToDelete.id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image");
      }

      setImages((current) => current.filter((image) => image.id !== imageToDelete.id));
      setDeleteId(null);
      setMessage("Image deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.24em] text-construct-red">
            Asset Depot
          </div>
          <h1 className="construct-heading mt-2 text-4xl text-construct-black md:text-5xl">
            IMAGE MANAGER
          </h1>
        </div>
        <div className="font-display text-xs uppercase tracking-[0.18em] text-construct-muted">
          JPG / PNG / GIF / WEBP / SVG · MAX 10MB
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

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          const files = Array.from(event.dataTransfer.files);
          void uploadFiles(files);
        }}
        className={`construct-card border-dashed p-8 text-center transition-all ${
          dragActive ? "bg-construct-yellow" : "bg-white"
        }`}
      >
        <div className="construct-heading text-3xl text-construct-black">
          DROP IMAGES HERE
        </div>
        <p className="mt-3 text-sm text-construct-muted">
          Drag, click to select, or paste an image from the clipboard.
        </p>
        <button
          type="button"
          className="construct-button construct-button-primary mt-6"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Select Images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            void uploadFiles(files);
          }}
        />
      </div>

      {loading ? (
        <div className="construct-card bg-white p-8">
          <LoadingState label="LOADING IMAGES" />
        </div>
      ) : images.length === 0 ? (
        <EmptyState
          title="NO IMAGE"
          description="Upload your first local image. Files are stored in storage/uploads."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <article key={image.id} className="construct-card construct-card-hover bg-white">
              <div className="flex items-center justify-between border-b-4 border-construct-black bg-construct-black px-4 py-2 text-white">
                <span className="font-display text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[10px] uppercase tracking-widest text-construct-yellow">
                  {formatFileSize(image.size)}
                </span>
              </div>

              <div className="bg-construct-paper p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="h-48 w-full border-4 border-construct-black bg-white object-contain"
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="truncate font-display text-sm" title={image.originalName}>
                  {image.originalName}
                </div>
                <div className="text-xs text-construct-muted">
                  {formatDateTime(image.createdAt)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="construct-button construct-button-secondary !px-3 !py-2"
                    onClick={() => copyText(image.url, "Image URL")}
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    className="construct-button construct-button-dark !px-3 !py-2"
                    onClick={() =>
                      copyText(`![${image.originalName}](${image.url})`, "Markdown")
                    }
                  >
                    Copy MD
                  </button>
                  <button
                    type="button"
                    className="construct-button construct-button-danger !px-3 !py-2"
                    onClick={() => setDeleteId(image.id)}
                    disabled={busyId === image.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(imageToDelete)}
        title="Delete this image?"
        description="The database record and the local file will be removed. Articles using this image may lose it."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        busy={Boolean(busyId)}
      />
    </div>
  );
}
