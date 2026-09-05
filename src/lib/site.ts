import { prisma } from "@/lib/prisma";

export async function getSiteSetting() {
  return prisma.siteSetting.findUnique({
    where: { id: "default" }
  });
}
