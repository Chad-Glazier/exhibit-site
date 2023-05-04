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
    const errorMessage = ErrorMessageSchema.safeParse(body);

    // got the expected response type, and the response was 2XX.
    if (expectedResponse.success && response.ok) {
      return {
        ok: true,
        status: response.status,
        body: expectedResponse.data,
      }
    }

    // got the expected response type, but the response wasn't 2XX.
    // this usually happens in conflict errors, where the API will
    // send back a 409 status code and the conflicting data.
    if (expectedResponse.success && !response.ok) {
      return {
        ok: false,
        status: response.status,
        body: expectedResponse.data,
        error: errorMessage.success ? 
          errorMessage.data.message 
          : "No error message provided."
      };
    }

    // didn't get the expected response type, but the response was 
    // 2XX.
    // this indicates a bug in the `ApiClient` code (the parent dir-
    // ectory of this function).
    if (!expectedResponse.success && response.ok) {
      return {
        ok: false,
        status: response.status,
        error: errorMessage.success ? 
          errorMessage.data.message
          : "Server sent an unexpected response body."
      };      
    }

    // didn't get the expected response type, and the response wasn't
    // 2XX. This just indicates that the server couldn't fulfill the 
    // request, and we should expect an error message in the response
    // body.
    return {
      ok: false,
      status: response.status,
      error: errorMessage.success ? 
        errorMessage.data.message
        : "Server sent an unexpected response body."
    };
  } catch {
    
    // the `response.json()` method threw an error, which means the
    // response body didn't include JSON. This indicates a bug in the
    // server code.
    return {
      ok: false,
      status: response.status,
      error: "Server didn't send a JSON response."
    }
  }
}