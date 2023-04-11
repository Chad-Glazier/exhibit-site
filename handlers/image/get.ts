import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/prisma";
import { Image } from "@prisma/client";
import { ErrorMessage } from "@/types";

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage | Image | Image[]>
): Promise<void> {
  let { url } = req.query;

  if (url === undefined || url === "") {
    return res
      .status(400)
      .json({ message: "This endpoint requires a `url` in the query string." })
  }

  if (url === "*") {
    const images: Image[] = await prisma.image.findMany();
    return res
      .status(200)
      .json(images);
  }

  if (Array.isArray(url)) {
    url = url.map(el => decodeURIComponent(el));

    const images: Image[] = await prisma.image.findMany({
      where: {
        url: { in: url }
      }
    });

    if (images.length === 0) {
      return res
        .status(404)
        .json({ message: "None of the listed images were found." });
    }

    return res
      .status(images.length === url.length ? 200 : 206)
      .json(images);
  }

  url = decodeURIComponent(url);
  const image: Image | null = await prisma.image.findUnique({
    where: { url }
  });
  
  if (image === null) {
    return res
      .status(404)
      .json({ message: "Image not found." });
  }

  return res
    .status(200)
    .json(image);
}