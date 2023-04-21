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

  const { messages, regenerate, edit } = req.body;
  if (!messages) return res.status(400).send({});

  const session = await getSession({ req });
  const user = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  const obj = await prisma.instance.findFirst({
    where: {
      id,
    },
  });
  if (!obj) return res.status(404).send({});

  const repository = InstanceRepository.fromJSON(obj.content);
  if (req.method === "POST") {
    await repository.addMessages(messages, { regenerate, edit }, user);

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
