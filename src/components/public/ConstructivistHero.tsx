import Link from "next/link";

export function ConstructivistHero({
  slogan,
  subtitle
}: {
  slogan: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden border-b-8 border-construct-black bg-construct-paper">
      <div className="construct-grid-bg absolute inset-0" />
      <div className="absolute -left-20 top-16 h-72 w-72 rotate-12 bg-construct-red" />
      <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full border-8 border-construct-blue" />
      <div className="absolute right-1/4 top-8 h-24 w-24 bg-construct-yellow" />
      <div className="absolute bottom-0 left-0 h-3 w-full bg-[repeating-linear-gradient(90deg,#0B0B0B_0,#0B0B0B_20px,#E62617_20px,#E62617_40px)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.35fr_0.65fr] md:px-8 md:py-24">
        <div>
          <div className="inline-flex items-center gap-3 border-4 border-construct-black bg-construct-black px-4 py-2">
            <span className="h-3 w-3 bg-construct-red" />
            <span className="font-display text-xs uppercase tracking-[0.28em] text-white">
              Constructivist Blog
            </span>
          </div>

          <h1 className="construct-heading mt-7 text-5xl text-construct-black md:text-8xl">
            {slogan}
          </h1>
          <p className="mt-6 max-w-2xl border-l-8 border-construct-red pl-5 text-lg leading-relaxed text-construct-ink md:text-xl">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/posts" className="construct-button construct-button-primary">
              Read Articles
            </Link>
            <Link href="/login" className="construct-button construct-button-secondary">
              Enter Admin
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          <div className="construct-card absolute right-0 top-4 w-full rotate-3 bg-white p-6">
            <div className="font-display text-xs uppercase tracking-[0.24em] text-construct-muted">
              Visual Manifesto
            </div>
            <div className="construct-heading mt-3 text-3xl text-construct-black">
              RED
              <br />
              BLACK
              <br />
              YELLOW
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-10 w-full bg-construct-red" />
              <div className="h-10 w-3/4 bg-construct-black" />
              <div className="h-10 w-1/2 bg-construct-yellow" />
              <div className="h-10 w-1/3 bg-construct-blue" />
            </div>
            <div className="absolute -bottom-6 -left-6 h-16 w-16 rotate-45 bg-construct-yellow" />
          </div>
        </div>
      </div>
    </section>
  );
}
