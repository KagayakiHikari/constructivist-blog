import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { createUniqueSlug } from "@/lib/slug";
import { postSchema } from "@/lib/validation";

export async function GET() {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }]
  });

  return NextResponse.json({
    posts: posts.map((post) => ({
      ...post,
      tags: post.tags ? post.tags.split(",").filter(Boolean) : []
    }))
  });
}

export async function POST(request: Request) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid post data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.slug
      ? await createUniqueSlug(data.slug)
      : await createUniqueSlug(data.title);

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        contentMarkdown: data.contentMarkdown,
        coverImage: data.coverImage || null,
        status: data.status,
        tags: data.tags.join(","),
        publishedAt: data.status === "PUBLISHED" ? new Date() : null
      }
    });

    return NextResponse.json(
      {
        post: {
          ...post,
          tags: post.tags ? post.tags.split(",").filter(Boolean) : []
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
