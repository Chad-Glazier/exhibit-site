import {
  ApiResponse,
  ExhibitType,
  PopulatedExhibitCreatable,
  PopulatedExhibit,
  PopulatedExhibitSchema
} from "@/types";
import parseResponse from "../parseResponse";

/**
 * Safely update an exhibit
 * 
 * @param originalTitle the title of the original exhibit that you want to 
 * update.
 * @param updatedExhibit the updated exhibit object (without cards).
 * @returns an `ApiResponse` object wrapping the updated exhibit as returned 
 * from the server, or an `ErrorMessage` object if the request could not be 
 * fulfilled. The following table describes the possible status codes and their
 * meaning:
 * | Status Code | Description |
 * | ----------- | ----------- |
 * | 200         | The exhibit was successfully updated. |
 * | 400         | The request body was invalid or the exhibit title was missing from the query string. |
 * | 403         | The master key was wrongly used to access this endpoint. |
 * | 404         | The exhibit was not found. |
 * | 500         | An error occurred while updating the exhibit. |
 */
export async function updateExhibit(
  originalTitle: string,
  updatedExhibit: Partial<PopulatedExhibitCreatable>
): Promise<ApiResponse<PopulatedExhibit>> {

  const response = await fetch("/api/exhibit?title=" + encodeURIComponent(originalTitle), {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedExhibit)
  });

  return await parseResponse<PopulatedExhibit>(PopulatedExhibitSchema, response);
}
