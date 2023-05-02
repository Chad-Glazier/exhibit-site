import { ApiResponse, ErrorMessageSchema } from "@/types";
import { ZodSchema } from "zod";

/**
 * Safely parses a `Response`, as returned from a `fetch` request.
 * 
 * @param expectedResponseSchema the Zod schema that represents `T`.
 * @param response a `Response` object, as returned from a `fetch` request
 * @returns an `ApiResponse` object wrapping a response of type `T`. If
 * there was an error and the response couldn't be parsed to type `T`,
 * then the `ok` field is set to `false` and the `error` field is set to
 * the error message.
 */
export default async function parseResponse<T>(
  expectedResponseSchema: ZodSchema<T>, 
  response: Response
): Promise<ApiResponse<T>> {
  try {
    const body: unknown = await response.json();
    const expectedResponse = expectedResponseSchema.safeParse(body);
    if (expectedResponse.success) {
      return {
        ok: true,
        status: response.status,
        body: expectedResponse.data
      }
    }
    const errorMessage = ErrorMessageSchema.safeParse(body);
    return {
      ok: false,
      status: response.status,
      error: errorMessage.success ? 
        errorMessage.data.message
        : "Server sent an unexpected response body."
    };
  } catch {
    return {
      ok: false,
      status: response.status,
      error: "Server didn't send a JSON response."
    }
  }
}