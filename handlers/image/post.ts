import { NextApiRequest, NextApiResponse } from "next/types";
import { IncomingForm } from "formidable";
import cloudinary from "@/cloudinary.config";

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const form = new IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Couldn't parse file" });
        return;
      }

      // Check if files.image exists
      if (!files.image) {
        res.status(400).json({ message: "No image file provided" });
        return;
      }

      // Handle the file upload to Cloudinary here.
      // Example:
      // const file = files.image;
      // const result = await cloudinary.uploader.upload(file.filepath, { folder: "your_folder_name" });

      // Send a response with the result
      res.status(200).json({ fields, files, /*result*/ });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Image upload failed" });
  }
}
