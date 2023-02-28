import * as z from "zod";

/**
 * Used as to report errors. The API will send back an `ErrorMessage` in its response
 * body if it cannot process a request. 
 * 
 * If the API sends back a successful request but the client has a problem parsing it, 
 * the client can use this with the `client` field set to true to indicate that the API
 * processed the request but returned something unexpected.
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