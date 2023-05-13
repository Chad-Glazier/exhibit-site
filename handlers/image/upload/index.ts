import { NextApiHandler } from "next";
import get from "./get";
import aggregateHandlers from "@/handlers/aggregateHandlers";

const handlers: Record<string, NextApiHandler<any>> = {
  "GET": get
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;