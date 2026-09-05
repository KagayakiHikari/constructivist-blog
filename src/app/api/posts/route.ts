import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      coverImage: true,
      tags: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true
    }
  });

  return NextResponse.json({
    posts: posts.map((post) => ({
      ...post,
      tags: post.tags ? post.tags.split(",").filter(Boolean) : []
    }))
  });
}
