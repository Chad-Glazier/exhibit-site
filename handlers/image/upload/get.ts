import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filename = decodeURIComponent(req.query.filename as string);
  if (!filename) {
    return res.status(400).json({
      message: "Missing filename."
    });
  }

  const target = path.join(process.cwd(), "public/uploads", req.query.filename as string);
  const readStream = fs.createReadStream(target);

  readStream.on("error", () => {
    return res.status(500).json({
      message: "Error reading image."
    });
  });

  readStream.pipe(res);
}