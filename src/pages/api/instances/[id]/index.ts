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

  const obj = await prisma.instance.findFirst({
    where: {
      id,
    },
  });
  if (!obj) return res.status(404).send({});

  const session = await getSession({ req });
  const user = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  if (!obj.public && obj.userId !== user?.id) return res.status(401).send({});

  if (req.method === "DELETE") {
    if (obj.userId !== user?.id) return res.status(401).json({});
    await prisma.instance.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({});
  }

  const repository = InstanceRepository.fromJSON(obj.content);
  if (req.method === "GET") {
    return res.status(201).json(await repository.serializeInstance(obj));
  } else if (req.method === "PATCH") {
    if (obj.userId !== user?.id) return res.status(401).json({});

    const { title, public: _public } = req.body;

    const updatedObj = await prisma.instance.update({
      where: {
        id,
      },
      data: {
        ...obj,
        title: title || obj.title,
        public: !!_public || obj.public,
      },
    });

    return res.status(201).json(await repository.serializeInstance(updatedObj));
  }

  return res.status(400).json({});
}
