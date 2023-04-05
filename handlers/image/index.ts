import { NextApiHandler } from "next/types";
import { ErrorMessage } from "@/types";
import post from "./post";
import del from "./del";
import aggregateHandlers from "@/handlers/aggregateHandlers";
import { withAuth } from "@/handlers/middleware";

const handlers: Record<string, NextApiHandler<ErrorMessage>> = {
  "POST": withAuth(post),
  "DELETE": withAuth(del)
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;