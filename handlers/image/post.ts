import { NextApiRequest, NextApiResponse } from "next/types";
import { File } from "formidable";
import path from "path";
import fs from "fs";
import { ErrorMessage } from "@/types";
import prisma from "@/prisma";
import { Image } from "@prisma/client";

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage | Image>,
  image: File
): Promise<void> {
  let newFilename: string;

  try {
    newFilename = await saveImageToFile(image);
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

async function saveImageToFile(image: File): Promise<string> {
  if (image.originalFilename === null) {
    throw new Error("No filename.");
  }

  const destinationDirectory = path.join(process.cwd(), "public/uploads");
  const basename: string = path.basename(image.originalFilename);
  const fileExtension: string = path.extname(basename);
  const fileNameWithoutExtension: string = basename
    .substring(0, basename.length - fileExtension.length);

  let destinationPath: string = path.join(destinationDirectory, image.originalFilename);
  let uniqueFileName = basename;
  
  for (let i = 1; fs.existsSync(destinationPath); i++) {
    uniqueFileName = `${fileNameWithoutExtension} (${i})${fileExtension}`;
    destinationPath = path.join(destinationDirectory, uniqueFileName);
  }

  return new Promise<string>((resolve, reject) => {
    const readStream = fs.createReadStream(image.filepath);
    const writeStream = fs.createWriteStream(destinationPath);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", () => resolve(path.join("/uploads", uniqueFileName)));

    readStream.pipe(writeStream);
  });
}
