import { InstanceRepository } from "@/lib/git";
import {
  InstanceResponse,
  InstanceListResponse,
  EmptyErrorResponse,
} from "@/types/api";
import { IMessage } from "@/types/chat";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib";

type IResponse = InstanceResponse | InstanceListResponse[] | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
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
      },
    });

    return res.status(201).json(await repository.serializeInstance(obj));
  } else if (req.method === "GET") {
    const list = await prisma.instance.findMany({
      select: {
        id: true,
        title: true,
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
