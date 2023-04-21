import { InstanceRepository } from "@/lib/git";
import {
  InstanceResponse,
  InstanceListResponse,
  EmptyErrorResponse,
} from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib";
import { getSession } from "next-auth/react";
import { getUserByEmail } from "@/utils/queries";

type IResponse = InstanceResponse | InstanceListResponse[] | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  const session = await getSession({ req });
  const user = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  if (req.method === "POST") {
    const { title, messages } = req.body;

    const repository = new InstanceRepository();
    await repository.init();
    await repository.addMessages(messages);
    const content = repository.toJSON();

    const obj = await prisma.instance.create({
      data: {
        content,
        title: title || "",
        userId: user ? user.id : undefined,
        public: !user,
      },
    });

    return res.status(201).json(await repository.serializeInstance(obj));
  } else if (req.method === "GET") {
    if (!user) return res.status(401).send({});

    const list = await prisma.instance.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        userId: user.id,
      },
    });

    return res.status(201).json(
      list.map((row) => ({
        id: row.id,
        title: row.title,
      }))
    );
  }

  return res.status(400).json({});
}
