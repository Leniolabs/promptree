import { prisma } from "@/lib";

export async function getUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: { email: email },
  });
}

export async function getUserImageById(id: string) {
  return (
    await prisma.user.findFirst({
      where: { id },
      select: {
        image: true,
      },
    })
  )?.image;
}

export async function getInstanceById(id: string) {
  return prisma.instance.findUnique({
    where: {
      id,
    },
  });
}
