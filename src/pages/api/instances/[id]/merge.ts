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

  if (req.method === "POST") {
    const { fromBranch, toBranch } = req.body;
    if (!fromBranch || !toBranch) return res.status(400).send({});

    const obj = await prisma.instance.findFirst({
      where: {
        id,
      },
    });
    if (!obj) return res.status(404).send({});

    const repository = InstanceRepository.fromJSON(obj.content);
    await repository.merge({
      fromBranch,
      toBranch,
    });

    const updatedObj = await prisma.instance.update({
      where: {
        id,
      },
      data: {
        content: repository.toJSON(),
      },
    });

    return res.status(200).json(await repository.serializeInstance(updatedObj));
  }

  return res.status(400).json({});
}
