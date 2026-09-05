import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml"
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[a-zA-Z0-9-]+\.(jpg|png|gif|webp|svg)$/.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const uploadDirectory = path.join(process.cwd(), "storage", "uploads");
  const filePath = path.resolve(uploadDirectory, filename);
  const expectedRoot = path.resolve(uploadDirectory);

  if (!filePath.startsWith(expectedRoot + path.sep)) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Error("Not a file");
    }

    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = CONTENT_TYPES[extension];

    if (!contentType) {
      return NextResponse.json({ error: "Unsupported image" }, { status: 400 });
    }

    const buffer = await readFile(filePath);
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Length": fileStat.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    });

    if (extension === "svg") {
      headers.set(
        "Content-Security-Policy",
        "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:"
      );
    }

    return new Response(new Uint8Array(buffer), { headers });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
