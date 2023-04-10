import {
  InstanceResponse,
  InstanceListResponse,
  EmptyErrorResponse,
} from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib";

type IResponse = InstanceResponse | InstanceListResponse[] | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === "POST") {
    const { title, model, mode, pointer, nodes, references } = req.body;

    const obj = await prisma.instance.create({
      data: {
        pointer: pointer || "",
        content: JSON.stringify(nodes || []),
        refs: JSON.stringify(references || []),
        title: title || "",
        mode: mode || "chat",
        model: model || "gpt-3.5-turbo",
      },
    });

    const { content: _content, ...temp } = obj;

    return res.status(201).json({
      ...temp,
      nodes: JSON.parse(_content || "[]"),
    });
  } else if (req.method === "GET") {
    const list = await prisma.instance.findMany({
      select: {
        id: true,
        title: true,
        mode: true,
        model: true,
      },
    });

    return res.status(201).json(
      list.map((row) => ({
        id: row.id,
        title: row.title,
        mode: row.mode,
        model: row.model,
      }))
    );
  }

  return res.status(400).json({});
}
