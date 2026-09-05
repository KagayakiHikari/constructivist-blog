import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { createUniqueSlug } from "@/lib/slug";
import { postSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({
    post: {
      ...post,
      tags: post.tags ? post.tags.split(",").filter(Boolean) : []
    }
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

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
      ? await createUniqueSlug(data.slug, id)
      : await createUniqueSlug(data.title, id);

    const shouldSetPublishedAt =
      data.status === "PUBLISHED" && !existing.publishedAt;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        contentMarkdown: data.contentMarkdown,
        coverImage: data.coverImage || null,
        status: data.status,
        tags: data.tags.join(","),
        publishedAt: shouldSetPublishedAt
          ? new Date()
          : data.status === "DRAFT"
            ? existing.publishedAt
            : existing.publishedAt
      }
    });

    return NextResponse.json({
      post: {
        ...post,
        tags: post.tags ? post.tags.split(",").filter(Boolean) : []
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
