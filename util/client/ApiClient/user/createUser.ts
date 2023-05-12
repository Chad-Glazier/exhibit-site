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
export async function postUser(user: User, options?: Partial<{
  masterKey?: string;
  dontLogIn?: boolean;
}>): Promise<ApiResponse<UserData>> {
  const masterKey = options ? options.masterKey : undefined;
  const dontLogIn = options ? options.dontLogIn : false;

  let response: Response;

  let target = "/api/user";
  if (dontLogIn) { target += "?dontLogIn=true"; }
  
  if (masterKey) {
    response = await fetch(target, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + masterKey
      },
      body: JSON.stringify(user)
    });    
  } else {
    response = await fetch(target, {
      method: "POST",
      credentials: "same-origin",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });    
  }

  return parseResponse<UserData>(UserDataSchema, response);
}

/**
 * Safely creates a new user on the server if the email isn't already
 * taken, otherwise it replaces the pre-existing user with the new one.
 * 
 * @param user a `User` object, including the unhashed password of the 
 * new user.
 * @returns the `UserData` of the new user, assuming the creation was 
 * successful.
 */
export async function putUser(user: User, options?: Partial<{
  masterKey?: string;
  dontLogIn?: boolean;
}>): Promise<ApiResponse<UserData>> {
  const masterKey = options ? options.masterKey : undefined;
  const dontLogIn = options ? options.dontLogIn : false;

  let response: Response;

  let target = "/api/user";
  if (dontLogIn) { target += "?dontLogIn=true"; }
  
  if (masterKey) {
    response = await fetch(target, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + masterKey
      },
      body: JSON.stringify(user)
    });    
  } else {
    response = await fetch(target, {
      method: "PUT",
      credentials: "same-origin",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });    
  }

  return parseResponse<UserData>(UserDataSchema, response);
}