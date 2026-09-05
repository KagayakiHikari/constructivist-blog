import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/upload";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;

  try {
    const image = await prisma.image.findUnique({ where: { id } });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await deleteUploadedFile(image.filename);
    await prisma.image.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
