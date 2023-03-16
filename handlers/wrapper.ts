import { ErrorMessage } from "@/types";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";

/**
 * This function wraps a group of `NextApiHandler`s, and returns a single
 * `NextApiHandler`. The important part is that, if the provided handlers
 * omit a certain method (e.g., `POST`), this wrapper will provide a response
 * to the client with a `404` status and an `ErrorMessage`. Additionally, it
 * wraps the appropriate handler method in a try-catch block to ensure that
 * no runtime errors break the program. In the event that a handler does throw
 * an error, this wrapper will send back a `500` response with a 
 * `ErrorMessage`.
 * 
 * @param handlers an object with a number of key-value pairs where each key 
 * represents a request method (in uppercase!), and each value represents a 
 * corresponding `NextApiHandler`. It then returns a single
 * `NextApiHandler<T | ErrorMessage>`, where `T` is provided as the generic
 * type to this function, `wrapHandlers`.
 * @returns A NextApiHandler
 */
export default function wrapHandlers<T>(
  handlers: Record<string, NextApiHandler>
): NextApiHandler<T | ErrorMessage> {
  return async function(
    req: NextApiRequest,
    res: NextApiResponse<T | ErrorMessage>
  ) {
    const handler = handlers[req.method ?? ""];
    
    if (!handler) {
      res.status(400)
        .json({
          message: `${req.url ? new URL(req.url).pathname : "this address"} does not accept ${req.method ? req.method + " requests." : "requests of that type."}`
        });
      return;
    }

    try {
      await handler(req, res);
    } catch(error: unknown) {
      res.status(500).json({
        message: "Unknown internal server error."
      });
    }
  }
}