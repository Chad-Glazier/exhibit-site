import { NextApiRequest, NextApiResponse } from "next/types";
import { File } from "formidable";
import path from "path";
import fs from "fs";
import { ErrorMessage } from "@/types";
import prisma from "@/prisma";
import { Image } from "@prisma/client";
import { s3Util } from "@/util/server";

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage | Image>,
  image: File
): Promise<void> {
  let newFilename: string;

  try {
    const uploadResult = await s3Util.put(image);
    if (typeof uploadResult === "string") {
      newFilename = uploadResult;
    } else {
      return res
        .status(500)
        .json(uploadResult);
    }
  } catch {
    return res
      .status(500)
      .json({ message: "Error saving image." });
  }

  await prisma.image.create({
    data: {
      url: newFilename
    }
  });

  return res.status(201).json({ url: newFilename });
}

