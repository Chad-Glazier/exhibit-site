import { NextApiRequest, NextApiResponse } from "next/types";
import cloudinary from "@/cloudinary.config";

export default async function del(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {}