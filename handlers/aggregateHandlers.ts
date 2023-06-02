import { ErrorMessage } from "@/types";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";

/**
 * This function takes a map of HTTP methods to handlers, and returns a single
 * `NextApiHandler` that will call the appropriate handler based on each request. 
 * 
 * This also wraps the handlers in a try/catch block, so that any errors thrown 
 * by the handlers will be caught and return a `500` error.
 *
 * @param handlers A map of HTTP methods to handlers
 * @returns A single, aggregate `NextApiHandler`.
 */
export default function aggregateHandlers<T>(
  handlers: Map<string, NextApiHandler>
): NextApiHandler<T | ErrorMessage> {
  return async function(
    req: NextApiRequest,
    res: NextApiResponse<T | ErrorMessage>
  ) {
    const handler = handlers.get(req.method ?? "");
    
    if (!handler) {
      res.status(400)
        .json({
          message: `${req.url ? new URL(req.url).pathname : "this address"} does not accept ${req.method ? req.method + " requests." : "requests of that type."}`
        });
      return;
    }

    try {
      await handler(req, res);
    } catch {
      res.status(500).json({
        message: "Unknown internal server error."
      });
    }
  }
}