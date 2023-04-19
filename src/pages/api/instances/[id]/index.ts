import { InstanceRepository } from "@/lib/git";
import { EmptyErrorResponse, InstanceResponse } from "@/types/api";
import { IMessage } from "@/types/chat";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib";

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

  if (req.method === "DELETE") {
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
    const { title } = req.body;

    const updatedObj = await prisma.instance.update({
      where: {
        id,
      },
      data: {
        ...obj,
        title: title || obj.title,
      },
    });

    return res.status(201).json(await repository.serializeInstance(updatedObj));
  }

  return res.status(400).json({});
}
