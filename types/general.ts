import * as z from "zod";

export interface ErrorMessage {
    message: string;
}

export const ErrorMessageSchema = z.object({
    message: z.string()
});

export interface Credentials {
    email: string;
    password: string;
}

export const CredentialsSchema = z.object({
    email: z.string(),
    password: z.string()
});

export interface TokenPayload {
    email: string;
}

export const TokenPayloadSchema = z.object({
    email: z.string()
});

export interface NewImage {
    newUrl: string;
}

export const NewImageSchema = z.object({
    newUrl: z.string()
});