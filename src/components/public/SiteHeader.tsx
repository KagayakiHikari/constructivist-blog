import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" }
];

export function SiteHeader({ siteTitle }: { siteTitle: string }) {
  return (
    <header className="sticky top-0 z-50 border-b-8 border-construct-black bg-construct-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="block h-9 w-9 bg-construct-red transition-transform group-hover:rotate-12" />
          <span className="construct-heading text-lg text-white md:text-2xl">
            {siteTitle}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="construct-heading relative text-sm text-white transition-colors hover:text-construct-yellow"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-1 w-0 bg-construct-yellow transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/login"
            className="construct-button construct-button-secondary !px-4 !py-2"
          >
            Login
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="construct-button construct-button-primary !px-4 !py-2">
            Menu
          </summary>
          <div className="absolute right-0 top-16 w-56 border-4 border-construct-black bg-white p-3 text-construct-black shadow-construct">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-b-2 border-dashed border-construct-black/20 px-3 py-3 font-display text-sm uppercase hover:bg-construct-yellow"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="mt-3 block bg-construct-black px-3 py-3 text-center font-display text-sm uppercase text-white"
            >
              Login
            </Link>
          </div>
        </details>
      </div>
      <div className="h-2 bg-[repeating-linear-gradient(45deg,#F7C61A_0,#F7C61A_18px,#E62617_18px,#E62617_36px)]" />
    </header>
  );
}

