import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSetting } from "@/lib/site";
import { ConstructivistHero } from "@/components/public/ConstructivistHero";
import { PostCard } from "@/components/public/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [setting, posts] = await Promise.all([
    getSiteSetting(),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }],
      take: 6
    })
  ]);

  return (
    <>
      <ConstructivistHero
        slogan={setting?.slogan ?? "BUILD THE PAGE LIKE A POSTER"}
        subtitle={setting?.subtitle ?? "GEOMETRY / WORDS / CODE"}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-8 border-construct-black pb-6">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.28em] text-construct-red">
              Latest Signal
            </div>
            <h2 className="construct-heading mt-3 text-4xl text-construct-black md:text-6xl">
              ARTICLE
              <br />
              WALL
            </h2>
          </div>
          <Link href="/posts" className="construct-button construct-button-dark">
            All Posts
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState
                title="NO PUBLISHED POST"
                description="The wall is still empty. Login to the admin panel and publish your first manifesto."
                action={
                  <Link
                    href="/login"
                    className="construct-button construct-button-primary"
                  >
                    Enter Admin
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </section>

      <section className="border-t-8 border-construct-black bg-construct-black py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-8">
          {[
            { number: "01", title: "GEOMETRY", text: "Diagonal blocks, hard grids, and poster-scale typography." },
            { number: "02", title: "STRUCTURE", text: "A clear content system powered by Next.js and Prisma." },
            { number: "03", title: "POWER", text: "Publish Markdown, upload local images, and control every post." }
          ].map((item) => (
            <div key={item.number} className="border-4 border-white bg-construct-black p-6">
              <div className="font-display text-4xl text-construct-yellow">
                {item.number}
              </div>
              <h3 className="construct-heading mt-4 text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
