import { PopulatedExhibit, ErrorMessage } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import handlers from "@/handlers/exhibit";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>
) {
    let handler = handlers[req.method ?? ""];
    
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
