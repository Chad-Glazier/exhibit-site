import parseResponse from "../parseResponse";
import { ApiResponse, UserData, UserDataSchema } from "@/types";

/**
 * Safely fetches a user's data from the server.
 * 
 * @param email the email associated with the user
 * @returns the `UserData` of the user
 */
export async function getUser(email: string): Promise<ApiResponse<UserData>> {
  const response = await fetch("/api/user?email=" + email);

  return parseResponse<UserData>(UserDataSchema, response);
}

/**
 * Safely fetches multiple users' data from the server.
 * 
 * @param emails the emails associated with the users
 * @returns a `UserData[]` representing the data of the users.
 */
export async function getUsers(...emails: string[]): Promise<ApiResponse<UserData[]>> {
  const response = await fetch("/api/user?email=" + emails.map(encodeURIComponent).join("&email="));

  if (emails.length == 0) {
    console.warn("No emails provided to `getUsers`. Try using `getAllUsers` instead.");
  }
  
  if (emails.length == 1) {
    console.warn("Only one email provided to `getUsers`. Try using `getUser` instead.");
  }

  return parseResponse<UserData[]>(UserDataSchema.array(), response);
}

/**
 * Safely fetches all users' data from the server.
 * 
 * @returns a `UserData[]` representing the data of the users.
 */
export async function getAllUsers(): Promise<ApiResponse<UserData[]>> {
  const response = await fetch("/api/user?email=*");
  
  return parseResponse<UserData[]>(UserDataSchema.array(), response);
}