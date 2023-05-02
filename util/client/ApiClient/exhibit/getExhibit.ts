import {
  ApiResponse,
  PopulatedExhibit,
  PopulatedExhibitSchema,
} from "@/types";
import parseResponse from "../parseResponse";

/**
 * Safely fetches an exhibit from the server by its title.
 * 
 * @param title the title of the exhibit to fetch
 * @returns an `ApiResponse` object wrapping a `PopulatedExhibit`.
 */
export async function getExhibit(title: string): Promise<ApiResponse<PopulatedExhibit>> {
  const response = await fetch("/api/exhibit?title=" + encodeURIComponent(title), {
    method: "GET",
    credentials: "same-origin"
  });

  return parseResponse<PopulatedExhibit>(PopulatedExhibitSchema, response);
}

/**
 * Safely fetches all exhibits with the provided titles.
 * 
 * @param titles this function takes any number of strings representing
 * titles of exhibits.
 * @return An `ApiResponse` object wrapping an array of `PopulatedExhibit`s
 */
export async function getExhibits(...titles: string[]): Promise<ApiResponse<PopulatedExhibit[]>> {
  const target: string = "/api/exhibit?title=" + titles.map(encodeURIComponent).join("&title=");
  
  const response: Response = await fetch(target, {
    method: "GET",
    credentials: "same-origin"
  });
  
  return parseResponse<PopulatedExhibit[]>(PopulatedExhibitSchema.array(), response);
}

/**
 * Safely fetches all populated exhibits on the server.
 * 
 * @returns an `ApiResponse` wrapping an array of all `PopulatedExhibit`s 
 * on the server
 */
export async function getAllExhibits(): Promise<ApiResponse<PopulatedExhibit[]>> {
  const response = await fetch("/api/exhibit?title=*", {
    method: "GET",
    credentials: "same-origin"
  });

  return parseResponse<PopulatedExhibit[]>(PopulatedExhibitSchema.array(), response);
}