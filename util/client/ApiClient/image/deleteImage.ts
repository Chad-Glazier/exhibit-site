import parseResponse from "../parseResponse";
import { ImageSchema, ApiResponse } from "@/types";
import { Image } from "@prisma/client";

/**
 * Safely delete an image from the server.
 * 
 * @param url the url of the image to be deleted.
 * @returns an `ApiResponse` object wrapping the deleted `Image` object.
 */
export async function deleteImage(url: string): Promise<ApiResponse<Image>> {
  const response = await fetch("/api/image?url=" + encodeURIComponent(url), {
    method: "DELETE",
    credentials: "same-origin"
  });

  return parseResponse<Image>(ImageSchema, response);
}

/**
 * Safely delete multiple images from the server.
 * 
 * @param urls any number of urls of the images to be deleted.
 * @returns an `ApiResponse` object wrapping the deleted `Image` objects.
 */
export async function deleteImages(...urls: string[]): Promise<ApiResponse<Image[]>> {
  const response = await fetch("/api/image?url=" + urls.map(encodeURIComponent).join("&url="), {
    method: "DELETE",
    credentials: "same-origin"
  });

  return parseResponse<Image[]>(ImageSchema.array(), response);
}

/**
 * Safely delete all images from the server.
 * 
 * @returns an `ApiResponse` object wrapping the deleted `Image` objects.
 */
export async function deleteAllImages(): Promise<ApiResponse<Image[]>> {
  const response = await fetch("/api/image?url=*", {
    method: "DELETE",
    credentials: "same-origin"
  });

  return parseResponse<Image[]>(ImageSchema.array(), response);
}