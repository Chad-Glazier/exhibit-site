import { ApiResponse, UserData, UserDataSchema } from "@/types";
import parseResponse from "../parseResponse";

export default async function getAuthentic(): Promise<ApiResponse<UserData>> {
  const response = await fetch("/api/user/authentic", {
    method: "GET",
    credentials: "same-origin" 
  });

  return parseResponse<UserData>(UserDataSchema, response);
}