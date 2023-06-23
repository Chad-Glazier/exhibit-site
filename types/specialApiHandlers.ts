import { NextApiRequest, NextApiResponse } from "next";
import { File } from "formidable";
import { UserData } from "@/types";

/**
 * This is a special type of NextApiHandler that includes a `File` object, which is
 * an image. This is used (exclusively) by the `withImage` middleware.
 */
export type NextApiImageHandler = 
  (req: NextApiRequest, res: NextApiResponse, image: File)
  => Promise<void>;

/**
 * This is a special type of NextApiHandler that includes a `UserData` object that
 * includes the data of the authenticated user. This is used (exclusively) by the
 * `withAuth` middleware.
 * 
 * `userData` is `null` if and only if the request was made with a valid master key
 * and there are no pre-existing users in the database. This should only be considered
 * acceptable for requests that create the first user in the database.
 */
export type NextApiAuthHandler =
  (req: NextApiRequest, res: NextApiResponse, userData: UserData | null)
  => Promise<void>;