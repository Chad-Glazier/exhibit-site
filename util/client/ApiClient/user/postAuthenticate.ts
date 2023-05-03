import { ApiResponse, Credentials, UserData, UserDataSchema } from "@/types";
import parseResponse from "../parseResponse";

/**
 * Safely authenticates a new user, returning their `UserData` and setting 
 * an authentication cookie if successful.
 * 
 * @param email the email of the user to authenticate
 * @param password the password of the user, as an unhashed string
 * @returns an `ApiResponse` wrapping the user's `UserData`.
 */
export default async function postAuthenticate(email: string, password: string): Promise<ApiResponse<UserData>> {
  const credentials: Credentials = {
    email, password
  }

  const response = await fetch("/api/user/authenticate", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  return parseResponse<UserData>(UserDataSchema, response);
}