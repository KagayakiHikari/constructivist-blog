import { getSiteSetting } from "@/lib/site";

export const metadata = {
  title: "About"
};

export default async function AboutPage() {
  const setting = await getSiteSetting();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_0.7fr]">
        <div className="construct-card construct-clip bg-white p-8 md:p-12">
          <div className="font-display text-xs uppercase tracking-[0.28em] text-construct-red">
            Manifesto
          </div>
          <h1 className="construct-heading mt-4 text-5xl text-construct-black md:text-7xl">
            ABOUT
            <br />
            THIS SITE
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-construct-ink">
            <p>
              This is not a quiet notebook. It is a publishing machine made from
              red blocks, black borders, yellow signals, and diagonal energy.
            </p>
            <p>
              The owner is {setting?.ownerName ?? "an independent writer"}. The site
              is built for writing, coding, designing, and collecting ideas that
              need a stronger shape.
            </p>
            <p>
              Every article is written in Markdown, stored in SQLite, and published
              through a custom admin panel. Images stay local. The visual language
              stays loud.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["RED", "BLACK", "YELLOW"].map((color, index) => (
              <div
                key={color}
                className={`border-4 border-construct-black p-5 ${
                  index === 0
                    ? "bg-construct-red text-white"
                    : index === 1
                      ? "bg-construct-black text-white"
                      : "bg-construct-yellow text-black"
                }`}
              >
                <div className="font-display text-xs uppercase tracking-[0.2em]">
                  0{index + 1}
                </div>
                <div className="construct-heading mt-2 text-2xl">{color}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="construct-card bg-construct-black p-6 text-white">
            <div className="font-display text-xs uppercase tracking-[0.2em] text-construct-yellow">
              Site
            </div>
            <h2 className="construct-heading mt-3 text-2xl">
              {setting?.siteTitle ?? "CONSTRUCTIVIST BLOG"}
            </h2>
            <p className="mt-3 text-sm text-white/70">{setting?.subtitle}</p>
          </div>

          <div className="construct-card bg-construct-red p-6 text-white">
            <div className="font-display text-xs uppercase tracking-[0.2em]">
              Slogan
            </div>
            <h2 className="construct-heading mt-3 text-3xl">
              {setting?.slogan ?? "BUILD THE PAGE LIKE A POSTER"}
            </h2>
          </div>

          <div className="construct-card bg-construct-yellow p-6">
            <div className="font-display text-xs uppercase tracking-[0.2em]">
              Links
            </div>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              {setting?.githubUrl ? (
                <a href={setting.githubUrl} className="block hover:underline">
                  GitHub
                </a>
              ) : null}
              {setting?.twitterUrl ? (
                <a href={setting.twitterUrl} className="block hover:underline">
                  Twitter
                </a>
              ) : null}
              {setting?.emailUrl ? (
                <a href={setting.emailUrl} className="block hover:underline">
                  Email
                </a>
              ) : null}
              {!setting?.githubUrl && !setting?.twitterUrl && !setting?.emailUrl ? (
                <span>No public links yet.</span>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
