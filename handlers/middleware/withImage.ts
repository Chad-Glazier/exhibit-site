import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import multer from "multer";

export default function withImage(
  next: NextApiHandler
) {
  return async function(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // implement this!!!!
    return next(req, res);
  }
}
