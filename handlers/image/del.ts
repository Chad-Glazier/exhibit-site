import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/prisma";
import { Image, Prisma } from "@prisma/client";
import { ErrorMessage } from "@/types";
import fs from "fs";
import path from "path";

export default async function del(
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage | Image | Image[]>
): Promise<void> {
  let url = req.query.url;

  if (url === undefined || url === "") {
    return res
      .status(400)
      .json({ message: "This endpoint requires a `url` in the query string." });
  }

  if (url === "*") {
    const deleted: Image[] = await prisma.image.findMany();
    await prisma.image.deleteMany();

    deleteImageFile(...deleted);

    return res
      .status(200)
      .json(deleted);
  }

  if (Array.isArray(url)) {
    const deleted: Image[] = await prisma.image.findMany({
      where: {
        url: { in: url }
      }
    });

    deleteImageFile(...deleted);

    const payload = await prisma.image.deleteMany({
      where: {
        url: { in: url }
      }
    });

    const status = payload.count === url.length ? 200 : 206;

    return res
      .status(status)
      .json(deleted);
  }

  const deleted: Image | null = await prisma.image.delete({
    where: { url }
  });

  if (!deleted) {
    return res
      .status(404)
      .json({ message: "Image not found." });
  }

  deleteImageFile(deleted);

  return res
    .status(200)
    .json(deleted);
}

function deleteImageFile(...images: Image[]) {
  for (let { url } of images) {
    const target = path.join(process.cwd(), "public/uploads", decodeURIComponent(url.split("/").pop()!));
    console.log(target);
    fs.unlink(target, () => {});
  }
}