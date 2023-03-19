import { ErrorMessage } from "@/types";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";

export default function aggregateHandlers<T>(
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