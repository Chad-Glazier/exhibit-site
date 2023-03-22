import { NextApiHandler } from "next/types";
import { ErrorMessage, UserData } from "@/types";
import post from "./post";
import aggregateHandlers from "@/handlers/aggregateHandlers";

const handlers: Record<string, NextApiHandler<ErrorMessage | UserData>> = {
  "POST": post
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;