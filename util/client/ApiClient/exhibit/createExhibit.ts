import {
  ApiResponse,
  PopulatedExhibit,
  PopulatedExhibitCreatable,
  PopulatedExhibitSchema,
} from "@/types";
import parseResponse from "../parseResponse";

/**
 * Safely create an exhibit if its title isn't already in use, or replace
 * the pre-existing exhibit if the title is in use.
 * 
 * @param newExhibit the new exhibit to create or replace on the server.
 * @returns a `PopulatedExhibit` representing the newly created/replaced
 * exhibit. If everything went well, this will be the same as the first
 * argument.
 */
export async function putExhibit(exhibit: PopulatedExhibitCreatable): Promise<ApiResponse<PopulatedExhibit>> {
  const response = await fetch("/api/exhibit", {
    method: "PUT",
    credentials: "same-origin",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(exhibit)
  });

  return parseResponse<PopulatedExhibit>(PopulatedExhibitSchema, response);
}

/**
 * Safely create an exhibit if the title isn't in use; otherwise return 
 * the pre-existing exhibit and the error message.
 * 
 * @param newExhibit the new exhibit to create on the server.
 * @returns a `PopulatedExhibit` representing the newly created exhibit,
 * if there wasn't a conflict. If there was a conflict, then the pre-
 * existing exhibit is included but the `ok` field is set to `false`.
 */
export async function postExhibit(exhibit: PopulatedExhibitCreatable): Promise<ApiResponse<PopulatedExhibit>> {
  const response = await fetch("/api/exhibit", {
    method: "POST",
    credentials: "same-origin",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(exhibit)
  });

  return parseResponse<PopulatedExhibit>(PopulatedExhibitSchema, response);
}