import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Post"
};

export default async function EditPostPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return <PostEditor initialPost={post} />;
}
