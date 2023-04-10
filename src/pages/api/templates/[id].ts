import { EmptyErrorResponse, TemplateResponse } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib";

type IResponse = TemplateResponse | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  const id = req.query?.id as string;
  if (!id) return res.status(404).send({});

  const obj = await prisma.template.findFirst({
    where: {
      id,
    },
  });
  if (!obj) return res.status(404).send({});

  if (req.method === "GET") {
    return res.status(201).json(obj);
  } else if (req.method === "PATCH") {
    const { title, content, type } = req.body;

    const patchObj = {
      ...obj,
    };

    if (title) patchObj.title = title;
    if (content) patchObj.content = content;
    if (type) patchObj.type = type;

    const updatedObj = await prisma.template.update({
      where: {
        id,
      },
      data: patchObj,
    });

    return res.status(200).json(updatedObj);
  } else if (req.method === "DELETE") {
    const deleted = await prisma.template.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({});
  }

  return res.status(400).json({});
}
