import { NextApiHandler } from "next/types";
import { ErrorMessage, AuthenticUser } from "@/types";
import post from "./post";
import aggregateHandlers from "@/handlers/aggregateHandlers";

const handlers: Record<string, NextApiHandler<ErrorMessage | AuthenticUser>> = {
  "POST": post
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;