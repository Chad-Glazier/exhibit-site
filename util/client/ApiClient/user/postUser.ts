import { User } from "@prisma/client";
import parseResponse from "../parseResponse";
import { ApiResponse, UserData, UserDataSchema } from "@/types";

/**
 * Safely posts a new user to the server.
 * 
 * @param user a `User` object, including the unhashed password of the 
 * new user.
 * @returns the `UserData` of the new user, assuming the post was successful.
 */
export async function postUser(user: User): Promise<ApiResponse<UserData>> {
  const response = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(user)
  });

  return parseResponse<UserData>(UserDataSchema, response);
}