import { ApiResponse, Credentials, UserData, UserDataSchema } from "@/types";
import parseResponse from "../parseResponse";

export default async function postAuthenticate(credentials: Credentials): Promise<ApiResponse<UserData>> {
  const response = await fetch("/api/user/authenticate", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  return parseResponse<UserData>(UserDataSchema, response);
}