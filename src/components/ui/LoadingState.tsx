export function LoadingState({ label = "LOADING" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="block h-6 w-6 animate-spin border-4 border-construct-black border-t-transparent" />
      <span className="font-display text-sm uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}
