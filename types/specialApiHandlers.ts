import { NextApiRequest, NextApiResponse } from "next";
import { File } from "formidable";

export type NextApiImageHandler = 
  (req: NextApiRequest, res: NextApiResponse, image: File)
  => Promise<void>;