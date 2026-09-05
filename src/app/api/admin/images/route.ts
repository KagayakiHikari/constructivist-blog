import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function GET() {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  try {
    const formData = await request.formData();
    const entries = [
      ...formData.getAll("file"),
      ...formData.getAll("files")
    ];
    const files = entries.filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await saveUploadedFile(file);

      const image = await prisma.image.create({
        data: uploaded
      });

      uploadedImages.push(image);
    }

    return NextResponse.json({ images: uploadedImages }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
