import * as z from "zod";

export interface Credentials {
  email: string;
  password: string;
}

export const CredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export interface LoggedInCredentials { 
  sessionId: string;
}

export const LoggedInCredentialsSchema = z.object({
  sessionId: z.string()
});