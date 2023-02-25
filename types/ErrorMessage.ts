import * as z from "zod";

/**
 * Used as a response when the API can't process a request.
 */
export interface ErrorMessage {
    message: string;
}

/**
 * A Zod object to represent an ErrorMessage.
 */
export const ErrorMessageSchema = z.object({
    message: z.string()
});