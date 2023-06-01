import { ErrorMessage } from "@/types";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";

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