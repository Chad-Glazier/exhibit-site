import { NextApiHandler } from "next/types";
import { ErrorMessage, AuthenticUser } from "@/types";
import get from "./get";
import aggregateHandlers from "@/handlers/aggregateHandlers";

const handlers: Record<string, NextApiHandler<ErrorMessage | AuthenticUser>> = {
  "GET": get
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;