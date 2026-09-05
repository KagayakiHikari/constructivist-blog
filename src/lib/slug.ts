import { prisma } from "@/lib/prisma";
import { slugifyText } from "@/lib/slugify";

export function slugify(input: string) {
  return slugifyText(input);
}

export async function createUniqueSlug(title: string, currentId?: string) {
  const base = slugifyText(title);
  let slug = base;
  let suffix = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || existing.id === currentId) return slug;

    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export function parseTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}
