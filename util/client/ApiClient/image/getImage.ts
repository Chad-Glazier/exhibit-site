import parseResponse from "../parseResponse";
import { ImageSchema } from "@/prisma/zod";
import { ApiResponse } from "@/types";
import { Image } from "@prisma/client";

/**
 * Safely get an image from the server.
 * 
 * @param url the url of the image to be deleted.
 * @returns an `ApiResponse` object wrapping the deleted `Image` object.
 */
export async function getImage(url: string): Promise<ApiResponse<Image>> {
  const response = await fetch("/api/image?url=" + encodeURIComponent(url), {
    method: "GET",
    credentials: "same-origin"
  });

  return parseResponse<Image>(ImageSchema, response);
}

/**
 * Safely get multiple images from the server.
 * 
 * @param urls any number of urls of the images to be deleted.
 * @returns an `ApiResponse` object wrapping the deleted `Image` objects.
 */
export async function getImages(...urls: string[]): Promise<ApiResponse<Image[]>> {
  const response = await fetch("/api/image?url=" + urls.map(encodeURIComponent).join("&url="), {
    method: "GET",
    credentials: "same-origin"
  });

  if (urls.length == 0) {
    console.warn("No emails provided to `getImages`. Try using `getAllImages` instead.");
  }
  
  if (urls.length == 1) {
    console.warn("Only one email provided to `getImages`. Try using `getImage` instead.");
  }

  return parseResponse<Image[]>(ImageSchema.array(), response);
}

/**
 * Safely get all images from the server.
 * 
 * @returns an `ApiResponse` object wrapping the deleted `Image` objects.
 */
export async function getAllImages(): Promise<ApiResponse<Image[]>> {
  const response = await fetch("/api/image?url=*", {
    method: "GET",
    credentials: "same-origin"
  });

  return parseResponse<Image[]>(ImageSchema.array(), response);
}