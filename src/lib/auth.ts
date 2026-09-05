import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user || user.role !== "ADMIN") return null;

  return user;
}

export async function requireAdminApi() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    };
  }

  return { user, response: null };
}
