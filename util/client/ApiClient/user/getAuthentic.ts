import { ApiResponse, UserData, UserDataSchema } from "@/types";
import parseResponse from "../parseResponse";

/**
 * Safely authenticates a new user by the authentication cookie, returning
 * the user's `UserData` if successful.
 * 
 * @returns an `ApiResponse` wrapping the user's `UserData`.
 */
export default async function getAuthentic(): Promise<ApiResponse<UserData>> {
  const response = await fetch("/api/user/authentic", {
    method: "GET",
    credentials: "same-origin" 
  });

  return parseResponse<UserData>(UserDataSchema, response);
}