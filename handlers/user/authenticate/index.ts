import { NextApiHandler } from "next/types";
import { ErrorMessage, UserData } from "@/types";
import post from "./post";
import aggregateHandlers from "@/handlers/aggregateHandlers";

const handlers = new Map<string, NextApiHandler<ErrorMessage | UserData>>();
handlers.set("POST", post);

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;