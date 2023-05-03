import parseResponse from "../parseResponse";
import { ImageSchema } from "@/prisma/zod";
import { ApiResponse } from "@/types";
import { Image } from "@prisma/client";

/**
 * Safely upload an image to the server.
 * 
 * @todo make it so that the function can also receive a string, representing
 * a pre-existing image, and then convert into a `File` object and send it to
 * the server.
 * 
 * @param image a `File` object representing the image to be uploaded.
 * @return an `ApiResponse` object 
 */
export async function postImage(image: File): Promise<ApiResponse<Image>> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/image", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  return parseResponse<Image>(ImageSchema, response);
}
