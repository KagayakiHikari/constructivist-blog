import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" }
  });

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
