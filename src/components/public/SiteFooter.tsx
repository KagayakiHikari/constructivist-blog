import Link from "next/link";

export function SiteFooter({
  ownerName,
  siteTitle
}: {
  ownerName: string;
  siteTitle: string;
}) {
  return (
    <footer className="border-t-8 border-construct-black bg-construct-black text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[2fr_1fr] md:px-8">
        <div>
          <div className="construct-heading text-3xl md:text-5xl">
            MAKE
            <br />
            STRUCTURE
            <br />
            VISIBLE
          </div>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
            {siteTitle} is a personal publishing space built with geometric contrast,
            hard grids, and strong visual order.
          </p>
        </div>

        <div className="space-y-4 border-l-4 border-construct-red pl-6">
          <div className="font-display text-xs uppercase tracking-[0.2em] text-construct-yellow">
            Owner
          </div>
          <div className="construct-heading text-xl">{ownerName}</div>
          <div className="flex flex-col gap-3">
            <Link href="/posts" className="font-display text-sm uppercase hover:text-construct-yellow">
              Article Wall
            </Link>
            <Link href="/about" className="font-display text-sm uppercase hover:text-construct-yellow">
              Manifesto
            </Link>
            <Link href="/login" className="font-display text-sm uppercase hover:text-construct-yellow">
              Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="h-2 bg-[repeating-linear-gradient(45deg,#F7C61A_0,#F7C61A_18px,#1D4ED8_18px,#1D4ED8_36px)]" />
    </footer>
  );
}
