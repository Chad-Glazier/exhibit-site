import { NextApiHandler } from "next/types";
import post from "./post";
import wrapHandlers from "@/handlers/wrapper";
import { LoggedInCredentials } from "@/types";

const handlers: Record<string, NextApiHandler> = {
  "POST": post
};

const handler: NextApiHandler = wrapHandlers<LoggedInCredentials>(handlers);

export default handler;