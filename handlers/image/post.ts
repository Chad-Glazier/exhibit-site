import { NextApiRequest, NextApiResponse } from "next/types";
import cloudinary from "@/cloudinary.config";

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const file = req.body.file;

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Image upload failed" });
  }
}
