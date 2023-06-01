import {
  ApiResponse,
  ExhibitType,
  ExhibitSchema,
  ExhibitCreatable,
  ExhibitCreatableSchema,
} from "@/types";
import parseResponse from "../parseResponse";

/**
 * Safely update the details of an exhibit.
 * 
 * @param originalTitle the title of the original exhibit that you want to 
 * update.
 * @param updatedExhibit the updated exhibit object (without cards).
 * @returns an `ApiResponse` object wrapping the updated exhibit as returned 
 * from the server, or an `ErrorMessage` object if the request could not be 
 * fulfilled.
 */
export async function updateExhibit(
  originalTitle: string,
  updatedExhibit: ExhibitCreatable
): Promise<ApiResponse<ExhibitType>> {

  const response = await fetch("/api/exhibit?title=" + encodeURIComponent(originalTitle), {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedExhibit)
  });

  return await parseResponse<ExhibitType>(ExhibitSchema, response);
}