import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.DEFAULT_ADMIN_USERNAME || "test";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || (process.env.CI ? "ci-only-admin" : "");

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: "ADMIN"
      }
    });
    console.log(`Default admin created: ${username}`);
  } else {
    console.log("Admin already exists; seed skipped.");
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteTitle: process.env.NEXT_PUBLIC_SITE_NAME || "CONSTRUCTIVIST BLOG",
      subtitle: "GEOMETRY / WORDS / CODE",
      ownerName: "Kagayaki Hikari",
      slogan: "BUILD THE PAGE LIKE A POSTER"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
