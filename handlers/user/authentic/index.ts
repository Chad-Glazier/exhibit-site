import { NextApiHandler } from "next/types";
import { ErrorMessage, UserData } from "@/types";
import get from "./get";
import aggregateHandlers from "@/handlers/aggregateHandlers";

const handlers = new Map<string, NextApiHandler<ErrorMessage | UserData>>();
handlers.set("GET", get);

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;