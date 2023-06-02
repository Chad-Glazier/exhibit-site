import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextApiImageHandler } from "@/types";
import { IncomingForm, File } from "formidable";

/**
 * Middleware that parses the request body as a `FormData` object, and then calls the
 * `next` handler with the `File` object if it succeeds.
 * 
 * @param next a `NextApiImageHandler`, which is a special type of `NextApiHandler` that
 * includes a `File` object, which is an image.
 * @returns a `NextApiHandler` that will parse the request body as a `FormData` object,
 * and then call the `next` handler with the `File` object if it succeeds.
 */
export default function withImage(
  next: NextApiImageHandler
): NextApiHandler {
  return async function(
    req: NextApiRequest, 
    res: NextApiResponse
  ) {
    let data;

    try {
      data = await parseFormData(req);
    } catch {
      return res
        .status(400)
        .json({ error: "Expected `FormData` in the body." });
    }

    const { image } = data;
    
    if (
      image === undefined ||
      Array.isArray(image) ||
      typeof image === "string"
    ) {
      return res
        .status(400)
        .json({ error: "The form had no `image` that is of the type `File` in the body." });
    }

    if (!isImageType(image)) {
      return res
        .status(400)
        .json({ error: "The request's `image` should be of an image type." });
    }

    await next(req, res, image);
  }
}

function parseFormData(
  req: NextApiRequest
): Promise<{ [x: string]: string | string[] | File | File[]; }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ ...fields, ...files });
    });
  });
}

function isImageType(file: File): boolean {
  const imageMimeTypePattern = /^image\//;
  return imageMimeTypePattern.test(file.mimetype || "");
}
