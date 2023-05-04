import { InstanceRepository } from "@/lib/git";
import { EmptyErrorResponse, InstanceResponse } from "@/types/api";
import { IMessage } from "@/types/chat";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib";
import { getSession } from "next-auth/react";
import { getUserByEmail } from "@/utils/queries";

type IResponse = InstanceResponse | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  const id = req.query?.id as string;
  if (!id) return res.status(404).send({});

  if (req.method === "POST") {
    const session = await getSession({ req });
    const user = session?.user?.email
      ? await getUserByEmail(session.user.email)
      : null;

    if (!user) return res.status(401).send({});

    const obj = await prisma.instance.findFirst({
      where: {
        id,
      },
      select: {
        content: true,
        public: true,
        title: true,
        userId: true,
      },
    });
    if (!obj) return res.status(404).send({});
    if (!obj.public && obj.userId !== user.id) return res.status(401).send({});

    const newObject = await prisma.instance.create({
      data: {
        ...obj,
        title: `Fork: ${obj.title}`,
        public: false,
        userId: user.id,
      },
    });

    return res.status(200).json({
      id: newObject.id,
    });
  }

  return res.status(400).json({});
}
