import parseResponse from "../parseResponse";
import { ApiResponse, UserType, UserDataSchema, UserData } from "@/types";

/**
 * Safely update a user on the server.
 * 
 * This will return unsuccessfully for the following reasons:
 * 
 * | Status Code | Reason |
 * |-------------|--------|
 * | 409         | The email address you're trying to change to is already in use by another user. The return value will include both an error message and the `UserData` of the conflicting user |
 * | 404         | The user you're trying to update (i.e., the `email` param) doesn't match any existing user. |
 * | 403         | You're not the master user and you're trying to update a user other than the current user. |
 * 
 * Note that if you update the current user and modify their email, you will receive a new
 * cookie that identifies the current user with the new email address. This is necessary because
 * the cookie is tied to the email address and relies on it to authenticate the user.
 * 
 * @param email the email of the user you want to update.
 * @param patchedUser a partial `UserType` object, which specifies the fields
 * to change. Any fields you omit will not be modified.
 * 
 * @returns an `ApiResponse` object containing either an error message or the updated `UserData`.
 */
export async function updateUser(
  email: string, 
  patchedUser: Partial<UserType>
): Promise<ApiResponse<UserData>> {
  let response: Response = await fetch("/api/user?user=" + encodeURIComponent(email), {
    method: "PATCH",
    credentials: "same-origin",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchedUser)
  });

  return parseResponse<UserData>(UserDataSchema, response);
}
