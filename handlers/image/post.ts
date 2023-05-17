import { NextApiRequest, NextApiResponse } from "next/types";
import { File } from "formidable";
import { ErrorMessage } from "@/types";
import prisma from "@/prisma";
import { Image } from "@prisma/client";
import { r2Bucket } from "@/util/server";
import { getBasename, getExtension } from "@/util";

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage | Image>,
  image: File
): Promise<void> {
  if (!image.originalFilename) {
    return res.status(400).json({ message: "No image provided." });
  }

  let newFilename = encodeURIComponent(image.originalFilename);
  try {
    const existingImages = await prisma.image.findMany();
    for (let i = 1; existingImages.some(({ url }) => getBasename(url) + getExtension(url) === newFilename); i++) {
      newFilename = encodeURIComponent(`${getBasename(image.originalFilename)} (${i})${getExtension(image.originalFilename)}`);
    }

    image.originalFilename = newFilename;

    const uploadResult = await r2Bucket.put(image);
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

