import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/prisma";
import { Image, Prisma } from "@prisma/client";
import { ErrorMessage } from "@/types";
import { r2Bucket } from "@/util/server";

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

    for (const image of deleted) {
      await r2Bucket.del(image.url);
    }

    await prisma.image.deleteMany();

    return res
      .status(200)
      .json(deleted);
  }

  if (Array.isArray(url)) {
    const targets: Image[] = await prisma.image.findMany({
      where: {
        url: { in: url }
      }
    });

    let successfullyDeleted = [];
    for (const { url } of targets) {
      if (typeof (await r2Bucket.del(url)) !== "string") {
        // deletion failed for some reason, most likely authorization
        return res.status(403).json({
          message: "You are not authorized to delete this image."
        })
      } else {
        successfullyDeleted.push(await prisma.image.delete({
          where: { url }
        }));
      }
    }

    const status = successfullyDeleted.length === url.length ? 200 : 206;

    return res
      .status(status)
      .json(successfullyDeleted);
  }

  try {
    const deletedFromR2 = await r2Bucket.del(url);
    if (typeof deletedFromR2 !== "string") {
      // deletion failed, most likely due to authorization
      return res.status(403).json({
        message: "You are not authorized to delete this image."
      })
    }

    const deleted: Image | null = await prisma.image.delete({
      where: { url }
    });    

    if (!deleted) {
      return res.status(200).json({
        url
      });
    }
    
    return res
      .status(200)
      .json(deleted);
      
  } catch {
    return res
      .status(404)
      .json({ message: "Image not found." });
  }
}
