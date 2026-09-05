import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, isSecureRequest } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: parsed.data.username }
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(
      parsed.data.password,
      user.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession(
      {
        sub: user.id,
        username: user.username,
        role: user.role
      },
      { secure: isSecureRequest(request) }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
