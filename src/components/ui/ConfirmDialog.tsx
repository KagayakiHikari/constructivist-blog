"use client";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Delete",
  onConfirm,
  onCancel,
  busy = false
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="construct-card w-full max-w-md bg-white p-6">
        <div className="border-b-4 border-construct-black pb-3">
          <div className="font-display text-xs uppercase tracking-[0.2em] text-construct-danger">
            Danger
          </div>
          <h3 className="construct-heading mt-2 text-2xl">{title}</h3>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-construct-muted">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="construct-button construct-button-dark !px-4 !py-2"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="construct-button construct-button-danger !px-4 !py-2"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
