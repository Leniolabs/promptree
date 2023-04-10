import { EmptyErrorResponse, InstanceResponse } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib";

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

  if (req.method === "GET") {
    const { content, refs, ...temp } = obj;

    return res.status(201).json({
      ...temp,
      nodes: JSON.parse(content || "[]"),
      references: JSON.parse(refs || "[]"),
    });
  } else if (req.method === "PATCH") {
    const { nodes, references, title, pointer } = req.body;

    const patchObj = {
      ...obj,
    };

    if (pointer) patchObj.pointer = pointer;
    if (nodes) patchObj.content = JSON.stringify(nodes || []);
    if (references) patchObj.refs = JSON.stringify(references || []);
    if (title) patchObj.title = title;

    const updatedObj = await prisma.instance.update({
      where: {
        id,
      },
      data: patchObj,
    });

    const { content: _content, refs: _refs, ...temp } = updatedObj;

    return res.status(200).json({
      ...temp,
      nodes: JSON.parse(_content || "[]"),
      references: JSON.parse(_refs || "[]"),
    });
  } else if (req.method === "DELETE") {
    const deleted = await prisma.instance.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({});
  }

  return res.status(400).json({});
}
