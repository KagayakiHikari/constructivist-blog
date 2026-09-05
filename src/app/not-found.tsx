import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-construct-paper px-4">
      <div className="construct-grid-bg absolute inset-0" />
      <div className="absolute -left-20 top-16 h-72 w-72 rotate-12 bg-construct-red" />
      <div className="absolute -right-12 bottom-12 h-64 w-64 rounded-full border-8 border-construct-blue" />

      <section className="construct-card construct-clip relative bg-white p-10 text-center md:p-16">
        <div className="font-display text-xs uppercase tracking-[0.28em] text-construct-red">
          Missing Signal
        </div>
        <h1 className="construct-heading mt-4 text-6xl text-construct-black md:text-8xl">
          404
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-construct-muted">
          This page has been removed from the structure. Return to the wall and
          choose another signal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="construct-button construct-button-primary">
            Home
          </Link>
          <Link href="/posts" className="construct-button construct-button-secondary">
            Posts
          </Link>
        </div>
      </section>
    </main>
  );
}
