import parseResponse from "../parseResponse";
import { ApiResponse, UserData, UserDataSchema } from "@/types";

/**
 * Safely deletes a user from the database.
 * 
 * @param email The email of the user to delete.
 * @returns The deleted user's `UserData`.
 */
export async function deleteUser(email: string): Promise<ApiResponse<UserData>> {
  const response: Response = await fetch(`/api/user?email=${email}`, {
    method: "DELETE",
    credentials: "same-origin"
  });
  return parseResponse<UserData>(UserDataSchema, response);
}

/**
 * Safely deletes multiple users from the database.
 * 
 * @param emails The emails of the users to delete.
 * @returns The deleted users' `UserData`.
 */
export async function deleteUsers(...emails: string[]): Promise<ApiResponse<UserData[]>> {
  const response: Response = await fetch("/api/user?email=" + emails.map(encodeURIComponent).join("&email="), {
    method: "DELETE",
    credentials: "same-origin"
  });
  return parseResponse<UserData[]>(UserDataSchema.array(), response);
}

/**
 * Safely deletes all users from the database.
 * 
 * @returns The deleted users' `UserData`.
 */
export async function deleteAllUsers(): Promise<ApiResponse<UserData[]>> {
  const response: Response = await fetch("/api/user?email=*", {
    method: "DELETE",
    credentials: "same-origin"
  });
  return parseResponse<UserData[]>(UserDataSchema.array(), response);
}