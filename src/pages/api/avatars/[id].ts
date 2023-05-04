import { EmptyErrorResponse, InstanceResponse } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { prisma } from "../../../lib";
import { getSession } from "next-auth/react";
import { getUserImageById } from "@/utils/queries";

type IResponse = InstanceResponse | EmptyErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  const id = req.query?.id as string;
  if (!id) return res.status(404).send({});

  if (req.method === "GET") {
    const image = await getUserImageById(id);
    if (!image) return res.status(404).send({});

    const response = await axios.get(image, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    res.setHeader("Content-Type", "image/png");
    return res.send(buffer);
  }

  return res.status(400).json({});
}
