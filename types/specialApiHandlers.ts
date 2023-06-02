import { NextApiRequest, NextApiResponse } from "next";
import { File } from "formidable";

/**
 * This is a special type of NextApiHandler that includes a `File` object, which is
 * an image. This is used (exclusively) by the `withImage` middleware.
 */
export type NextApiImageHandler = 
  (req: NextApiRequest, res: NextApiResponse, image: File)
  => Promise<void>;