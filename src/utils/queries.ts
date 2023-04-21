import { prisma } from "@/lib";

export async function getUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: { email: email },
  });
}

export async function getInstanceById(id: string) {
  return prisma.instance.findUnique({
    where: {
      id,
    },
  });
}
