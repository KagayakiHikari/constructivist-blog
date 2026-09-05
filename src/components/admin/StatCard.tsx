export function StatCard({
  number,
  label,
  value,
  tone = "white"
}: {
  number: string;
  label: string;
  value: string | number;
  tone?: "white" | "red" | "yellow" | "blue";
}) {
  const tones: Record<string, string> = {
    white: "bg-white text-construct-black",
    red: "bg-construct-red text-white",
    yellow: "bg-construct-yellow text-construct-black",
    blue: "bg-construct-blue text-white"
  };

  return (
    <div className={`construct-card p-6 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-xs uppercase tracking-[0.2em] opacity-70">
          {number}
        </span>
        <span className="block h-4 w-4 bg-construct-black" />
      </div>
      <div className="construct-number construct-heading mt-5 text-5xl">{value}</div>
      <div className="mt-2 font-display text-xs uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}
