import {
  EmptyErrorResponse,
  TemplateListResponse,
  TemplateResponse,
} from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib";

type IResponse = TemplateResponse | TemplateListResponse | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === "POST") {
    const { title, content, type } = req.body;

    const obj = await prisma.template.create({
      data: {
        title: title || "",
        content: content || "",
        type: type || "chat-input",
      },
    });

    return res.status(201).json(obj);
  } else if (req.method === "GET") {
    const list = await prisma.template.findMany({
      select: {
        id: true,
        title: true,
        type: true,
      },
    });

    return res.status(201).json(list);
  }

  return res.status(400).json({});
}
